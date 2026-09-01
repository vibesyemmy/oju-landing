/**
 * The behaviour behind both viewers.
 *
 * They looked like different things — one walks a filtered wall of adverts, the
 * other one company's set — but they are the same operation: move through a
 * *scope* of slides. The scope is the only part that differs, so it is the only
 * part a caller supplies. Campaigns pass whatever the roster filter leaves
 * visible; the work gallery passes one project's pieces.
 *
 * Everything else was duplicated between them and is here once: parking image
 * URLs until a slide is wanted, the directional slide, hiding a slide again
 * once it has left, and returning focus to whatever opened the viewer.
 *
 * The <dialog> itself supplies Esc, the focus trap, the inert background and
 * the backdrop, so none of that is reimplemented.
 */

export type LightboxContext = {
  /** The slide now showing. */
  slide: HTMLImageElement;
  /** Its index in the full slide list. */
  index: number;
  /** Its 1-based place within the current scope. */
  position: number;
  /** How many slides the scope holds. */
  total: number;
};

export type LightboxOptions = {
  /**
   * Indices navigable right now, in order. Called on every move, so it always
   * reflects the current state rather than a snapshot taken at open time.
   */
  scope: () => number[];
  /** Update whatever the page shows about the current slide. */
  onShow?: (ctx: LightboxContext) => void;
  /** Runs after the dialog opens. */
  onOpen?: (ctx: LightboxContext) => void;
};

/** How far a slide travels as it enters or leaves. */
const TRAVEL = 44;

export function createLightbox(root: HTMLDialogElement, options: LightboxOptions) {
  const slides = [...root.querySelectorAll<HTMLImageElement>('[data-lb-slide]')];
  if (!slides.length) return null;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let opener: HTMLElement | null = null;
  let index = -1;

  /**
   * Give a slide its URL. Nothing carries one until it is wanted: lazy loading
   * defers on viewport proximity, and an element in a display:none subtree has
   * no intersection to measure, so a hidden image with a src is fetched like
   * any other.
   */
  const attach = (img?: HTMLImageElement | null) => {
    if (!img || img.getAttribute('src')) return;
    const { src, srcset } = img.dataset;
    if (srcset) img.setAttribute('srcset', srcset);
    if (src) img.setAttribute('src', src);
  };

  /** The current slide and its neighbours, so a step is never a blank beat. */
  const warm = (i: number) => {
    const set = options.scope();
    const at = set.indexOf(i);
    const around = at === -1 ? [i] : [i, set[(at + 1) % set.length], set[(at - 1 + set.length) % set.length]];
    around.forEach((n) => n !== undefined && attach(slides[n]));
  };

  /**
   * Swap slides with a directional slide.
   *
   * `hidden` is display:none, which cannot transition and is also what keeps
   * the other slides from being fetched. So the incoming one is unhidden and
   * placed at its start offset with transitions off, forced to lay out, and
   * only then released — and the outgoing one is hidden again once it has
   * finished leaving, restoring the cheap resting state.
   */
  const move = (from: HTMLImageElement | null, to: HTMLImageElement, dir: number) => {
    attach(to);
    to.hidden = false;

    if (dir === 0 || reduced.matches) {
      to.classList.add('is-current');
      if (from && from !== to) {
        from.classList.remove('is-current');
        from.hidden = true;
      }
      return;
    }

    to.style.transition = 'none';
    to.style.transform = `translateX(${dir * TRAVEL}px)`;
    void to.offsetWidth; // commit the start position before animating from it
    to.style.transition = '';
    to.style.transform = '';
    to.classList.add('is-current');

    if (from && from !== to) {
      from.classList.remove('is-current');
      from.style.transform = `translateX(${-dir * TRAVEL}px)`;
      // A transitionend can be missed if the slide is swapped again mid-flight,
      // so the timeout is the guarantee and the listener only makes it prompt.
      const settle = () => {
        if (from.classList.contains('is-current')) return; // came back
        from.hidden = true;
        from.style.transform = '';
      };
      from.addEventListener('transitionend', settle, { once: true });
      setTimeout(settle, 520);
    }
  };

  const show = (next: number, dir = 0) => {
    const from = index >= 0 ? slides[index] : null;
    index = next;
    move(from, slides[index], dir);
    warm(index);

    const set = options.scope();
    const place = set.indexOf(index);
    options.onShow?.({
      slide: slides[index],
      index,
      position: place >= 0 ? place + 1 : 1,
      total: set.length,
    });
  };

  const step = (delta: number) => {
    const set = options.scope();
    if (set.length < 2) return;
    const at = set.indexOf(index);
    const from = at === -1 ? 0 : at;
    show(set[(from + delta + set.length) % set.length], delta > 0 ? 1 : -1);
  };

  const open = (at: number, from?: HTMLElement | null) => {
    opener = from ?? null;
    show(at);
    root.showModal();
    const set = options.scope();
    options.onOpen?.({
      slide: slides[index],
      index,
      position: Math.max(1, set.indexOf(index) + 1),
      total: set.length,
    });
  };

  root.querySelector('[data-lb-prev]')?.addEventListener('click', () => step(-1));
  root.querySelector('[data-lb-next]')?.addEventListener('click', () => step(1));
  root.querySelector('[data-lb-close]')?.addEventListener('click', () => root.close());

  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
  });

  /* Clicking the ground around the artwork closes. The dialog fills the
     viewport, so the backdrop never receives the click — the target is the
     dialog itself, or the stage padding around the frame. */
  root.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    if (t === root || t.classList.contains('lb__stage') || t.classList.contains('lb__frame')) {
      root.close();
    }
  });

  /* Back to whatever opened it, so a keyboard user lands where they were
     rather than at the top of the page. */
  root.addEventListener('close', () => {
    opener?.focus();
    opener = null;
  });

  return { open, show, step, close: () => root.close(), slides };
}
