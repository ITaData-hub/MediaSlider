import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewEncapsulation,
  ContentChildren,
  QueryList,
  Renderer2,
  Inject,
  AfterContentInit,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
  selector: 'itd-media-viewer-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './media-viewer-slider.component.html',
  styleUrls: ['./media-viewer-slider.component.scss'],
  
  changeDetection: ChangeDetectionStrategy.OnPush,                                                // Используется стратегия обнаружения изменений OnPush для оптимизации производительности.
  
  encapsulation: ViewEncapsulation.None,                                                          // Отключена инкапсуляция стилей, чтобы компонент мог использовать глобальные стили.
})
export class MediaViewerSliderComponent implements OnDestroy, AfterViewInit {

  @ViewChild('slider') sliderRef!: ElementRef;                                                    // Ссылка на основной контейнер слайдера.
  @ViewChild('sliderList') sliderListRef!: ElementRef;                                            // Ссылка на список слайдов (контейнер).
  @ViewChild('sliderTrack') sliderTrackRef!: ElementRef;                                          // Ссылка на трек слайдов (элемент, который перемещается).
  @ViewChild('prevArrow') prevArrowRef!: ElementRef;                                              // Ссылка на кнопку "Предыдущий".
  @ViewChild('nextArrow') nextArrowRef!: ElementRef;                                              // Ссылка на кнопку "Следующий".
  @ViewChild('dotsContainer') dotsContainerRef!: ElementRef;                                      // Ссылка на контейнер с точками навигации.
  @ContentChildren('slide', { read: ElementRef })                                                 // Коллекция дочерних элементов со селектором 'slide'.
  slideElements!: QueryList<ElementRef>;

  @Input() gap: number  = 0                                                                // Защита от отрицательных значений для отступа между слайдами.
  @Input() slidesPerView: number = 1                                                     // Минимальное значение для количества слайдов на экране — 1.
  @Input() clientSlideWidth: number = 0;                                                          // Ширина каждого слайда (если задана).
  @Input() hideArrows: boolean = false;                                                           // Флаг для скрытия кнопок "Предыдущий" и "Следующий".
  @Input() hideDots: boolean = false;                                                             // Флаг для скрытия точек навигации.
  @Input() dotsInside: boolean = false;                                                           // Размещение точек внутри слайдера.
  @Input() arrowsInside: boolean = false;                                                         // Размещение кнопок "Предыдущий" и "Следующий" внутри слайдера.
  @Input() squareSlide: boolean = false;                                                          // Если true, слайды будут иметь квадратную форму.
  @Input() autoplay: boolean = false;                                                             // Флаг для включения автоматической прокрутки слайдера.
  @Input() autoplayTime: number = 20;                                                             // Интервал времени между автоматическими переходами (в секундах).
  @Input() infinity: boolean = false;                                                             // Флаг для включения бесконечной прокрутки слайдера.


  
  private dots: HTMLDivElement[] = [];                                                            // Массив точек навигации.
  private slideIndex = 0;                                                                         // Текущий индекс слайда.
  private posX1 = 0;                                                                              // Начальная позиция X при жесте.
  private posX2 = 0;                                                                              // Разница между текущей и предыдущей позицией X.
  private posY1 = 0;                                                                              // Начальная позиция Y при жесте.
  private posY2 = 0;                                                                              // Разница между текущей и предыдущей позицией Y.
  private posInitial = 0;                                                                         // Первоначальная позиция X при начале жеста.
  private isSwiping = false;                                                                      // Флаг, указывающий, что пользователь совершает жест.
  private allowTransitions = true;                                                                // Флаг, указывающий, что переходы между слайдами разрешены.
  private readonly trfRegExp = /([-0-9.]+(?=px))/;                                                // Регулярное выражение для извлечения текущего значения transform из стиля.
  private slideWidth: number = 0;                                                                 // Ширина каждого слайда.
  private dotsRemovers: (() => void)[] = [];                                                      // Массив удалителей для событий клика на точках навигации.
  private autoplayInterval: any | null = null;                                                    // Интервал времени между автоматическими переходами (в секундах).
  private offsetCache: { totalSlidesWidth: number;                                                // Значение смещения слайда
    sliderListWidth: number; 
    maxOffset: number } | null = null;
  
  private touchStartRemover: (() => void) | null = null;                                          // Удалитель слушателя для события 'touchstart'.
  private mouseDownRemover: (() => void) | null = null;                                           // Удалитель слушателя для события 'mousedown'.  
  private touchMoveRemover: (() => void) | null = null;                                           // Удалитель слушателя для события 'touchmove'.
  private touchEndRemover: (() => void) | null = null;                                            // Удалитель слушателя для события 'touchend'.
  private mouseMoveRemover: (() => void) | null = null;                                           // Удалитель слушателя для события 'mousemove'.
  private mouseUpRemover: (() => void) | null = null;                                             // Удалитель слушателя для события 'mouseup'.
  private prevArrowClickRemover: (() => void) | null = null;                                      // Удалитель слушателя для клика на кнопке "Предыдущий".
  private nextArrowClickRemover: (() => void) | null = null;                                      // Удалитель слушателя для клика на кнопке "Следующий".


/**
 * Конструктор для слайдера.
 * @param cdr: ChangeDetectorRef - cервис для оповещения Angular о необходимости обновления представления.
 * @param renderer: Renderer2 - сервис для безопасной работы с DOM.
 * @param document: Document - сервис для доступа к DOM.
 */
  constructor(
    private cdr: ChangeDetectorRef,                                                               
    private renderer: Renderer2,                                                                  
    @Inject(DOCUMENT) private document: Document                                                  
  ) {}
  /**
   * Инициализирует слайдер после полной загрузки DOM.
   */
  ngAfterViewInit(): void {
      if (!this.sliderRef || !this.sliderListRef || !this.sliderTrackRef) {
        console.warn('Some slider references are not ready yet');
        return;
      }
          this.initializeSlider();
  }

  /**
   * Применяет модификаторы классов к основному контейнеру слайдера.
   */
  private applyMods(): void {
    if (!this.sliderRef || !this.sliderRef.nativeElement) {
      console.warn('Slider reference is not ready yet');
      return;
    }
  
    const sliderClassList = this.sliderRef.nativeElement.classList;

    ['no-arrows', 'no-dots', 'dots-inside', 'arrows-inside'].forEach((cls) =>                     // Удаляет все модификаторы классов.
      this.renderer.removeClass(this.sliderRef.nativeElement, cls)
    );
    
    if (this.dotsInside) {
      this.renderer.addClass(this.sliderRef.nativeElement, 'dots-inside');                        // Добавляет модификаторы классов в зависимости от входных параметров.
    }
    if (this.arrowsInside) {
      this.renderer.addClass(this.sliderRef.nativeElement, 'arrows-inside');
    }
  }
  /**
   * Полная инициализация слайдера.
   */
  private initializeSlider(): void {
    console.log('Initializing slider...');
  
    if (!this.sliderRef || !this.sliderListRef || !this.sliderTrackRef) {                         // Предупреждение, если ссылки на элементы еще не готовы.
      console.warn('Some slider references are not ready yet');
      return;
    }
  
    if (!this.slideElements || this.slideElements.length === 0) {                                 // Предупреждение, если слайды отсутствуют.
      console.warn('No slides available');
      return;
    }
    this.applyMods();                                                                             // Применяет модификаторы классов.
    this.setupEventListeners();                                                                   // Устанавливает слушатели событий.
    this.calculateSlideDimensions();                                                              // Рассчитывает размеры слайдов.
    this.setSlideStyles();                                                                        // Устанавливает стили для слайдов.
    this.createDots();                                                                            // Создает точки навигации.
    this.updateSliderPosition();                                                                  // Обновляет текущую позицию слайдера.
  
    if (this.autoplay) {
      this.startAutoplay();
    }
  }
  /**
   * Рассчитывает размеры слайдов и контейнера.
   */
  private calculateSlideDimensions(): void {
    if (!this.sliderListRef || !this.sliderListRef.nativeElement) {
      console.warn('Slider list reference is not ready yet');                                      // Предупреждение, если ссылка на список слайдов еще не готова.
      return;
    }
  
    const docSliderWidth = this.sliderListRef.nativeElement.clientWidth;                           // Получает ширину контейнера слайдов.
  
    if (docSliderWidth <= 0) {
      console.warn('Slider container width is zero or not ready');                                 // Предупреждение, если ширина контейнера слайдов равна нулю.
      return;
    }
  
    if (this.squareSlide) {
      this.clientSlideWidth = this.sliderListRef.nativeElement.clientHeight;                       // Если включены квадратные слайды, использует высоту контейнера для ширины слайдов.
    }
  
    if (this.clientSlideWidth > 0) {                                                               
      const maxSlideWidth = docSliderWidth / this.slidesPerView;                                   // Максимальная ширина одного слайда.
      this.slideWidth = Math.min(this.clientSlideWidth, maxSlideWidth);                            // Выбирает минимальное значение из clientSlideWidth и maxSlideWidth.
  
      this.slidesPerView = Math.floor(                                                             // Рассчитывает количество слайдов, которые можно показать одновременно.
        (docSliderWidth + this.gap) / (this.slideWidth + this.gap)
      );
    } else {                                                                                       // Рассчитывает ширину слайда, если clientSlideWidth не задан.
      this.slideWidth =
        (docSliderWidth - (this.slidesPerView - 1) * this.gap) / this.slidesPerView;
    }
  
    if (this.gap === 0 && this.clientSlideWidth > 0) {                                              // Корректирует gap, если он равен 0.
      this.gap =
        (docSliderWidth - this.slidesPerView * this.clientSlideWidth) /
        (this.slidesPerView - 1);
    }
  
    this.cdr.detectChanges();                                                                       // Оповещает Angular о необходимости обновления представления.
  }

  /**
   * Устанавливает стили для каждого слайда.
   * - Добавляет класс 'slide' каждому слайду.
   * - Устанавливает ширину слайда.
   * - Устанавливает расстояние между слайдами.
   */
  private setSlideStyles(): void {
    if (!this.slideElements || this.slideElements.length === 0) {
      console.warn('No slides to set styles');                                                      // Предупреждение, если слайды отсутствуют.
      return;
    }
  
    this.slideElements.forEach((slideRef) => {
      const slide = slideRef.nativeElement;

      this.renderer.addClass(slide, 'slide');                                                       // Добавляет класс 'slide' каждому слайду.
      this.renderer.setStyle(slide, 'width', `${this.slideWidth}px`);                               // Устанавливает ширину слайда.
      this.renderer.setStyle(slide, 'gap', `${this.gap}px`);                                        // Устанавливает расстояние между слайдами.
    });
  
    // if (this.slideElements.length > 0) {
    //   const lastSlide = this.slideElements.last.nativeElement;
    //   this.renderer.setStyle(lastSlide, 'marginRight', '0');
    // }
  }

  /**
   * Устанавливает слушатели событий для управления слайдером.
   * - Добавляет слушатель для события 'touchstart'.
   * - Добавляет слушатель для события 'mousedown'.
   * - Добавляет слушатель для события 'click' на стрелку назад.
   * - Добавляет слушатель для события 'click' на стрелку вперед.
   */
  private setupEventListeners(): void {
    this.touchStartRemover = this.renderer.listen(                                                 // Добавляет слушатель для события 'touchstart'.
      this.sliderRef.nativeElement,
      'touchstart',
      this.onTouchStart.bind(this)
    );

    this.mouseDownRemover = this.renderer.listen(                                                  // Добавляет слушатель для события 'mousedown'.
      this.sliderRef.nativeElement,
      'mousedown',
      this.onMouseDown.bind(this)
    );

    if (this.prevArrowRef) {
      this.prevArrowClickRemover = this.renderer.listen(                                           // Добавляет слушатель для события 'click' на стрелку назад.
        this.prevArrowRef.nativeElement,
        'click',
        this.onPrevClick.bind(this)
      );
    }

    if (this.nextArrowRef) {
      this.nextArrowClickRemover = this.renderer.listen(                                           // Добавляет слушатель для события 'click' на стрелку вперед.
        this.nextArrowRef.nativeElement,
        'click',
        this.onNextClick.bind(this)
      );
    }
  }

  /**
   * Создает точки навигации.
   * - Очищает контейнер точек.
   * - Создает точки навигации.
   * - Добавляет точки в DOM
   */
  private createDots(): void {
    if (!this.dotsContainerRef || !this.slideElements || this.slideElements.length === 0) {
      console.warn('dotsContainerRef is null or undefined or no slides available');                // Предупреждение, если слайды отсутствуют или нет ссылки на 'dotsContainerRef'
      return;
    }
  
    const dotsContainer = this.dotsContainerRef.nativeElement;
    while (dotsContainer.firstChild) {                                                             // Очищает контейнер точек.
      dotsContainer.removeChild(dotsContainer.firstChild);
    }
  
    this.dots = [];
    const numDots = Math.ceil(this.slideElements.length / this.slidesPerView);                     // Рассчитывает количество точек навигации.
  
    for (let i = 0; i < numDots; i++) {
      const dot = this.renderer.createElement('div');                                              // Создает точку навигации.
      this.renderer.addClass(dot, 'dot');                                                          // Добавляет класс 'dot' к точке навигации.
  
      const dotClickHandler = () => this.goToSlide(i * this.slidesPerView);                        // Добавляет слушатель клика на точку навигации.
      const remover = this.renderer.listen(dot, 'click', dotClickHandler);
      this.dotsRemovers.push(remover);
  
      this.renderer.appendChild(dotsContainer, dot);                                               // Добавляет точку навигации в элемент-контейнер точек.
      this.dots.push(dot);                                                                         // Сохраняет точку в локальном массиве.
    }
  
    this.updateActiveDot();                                                                        // Обновляет активную точку.
    this.cdr.markForCheck();                                                                       // Оповещает Angular о необходимости проверки изменений.
  }

  /**
   * Обновляет активную точку навигации.
   * - Обходит все точки навигации и устанавливает класс 'active' только для активной точки.
   */
  private updateActiveDot(): void {
    const activeDotIndex = Math.floor(this.slideIndex / this.slidesPerView);                       // Рассчитывает индекс активной точки.

    this.dots.forEach((dot, i) => {
      if (i === activeDotIndex) {
        this.renderer.addClass(dot, 'active');                                                     // Добавляет класс 'active' к активной точке.
      } else {
        this.renderer.removeClass(dot, 'active');                                                  // Удаляет класс 'active' у остальных точек.
      }
    });


    this.cdr.markForCheck();                                                                       // Оповещает Angular о необходимости проверки изменений.
  }
  
  /**
   * Перемещается к указанному индексу слайда.
   * - Регулирует переход слайдов при бесконечной прокрутке и в ручную.
   */
  private goToSlide(index: number): void {
    let fast:boolean = false;
    if (this.infinity) {
      if (index >= this.slideElements.length) {                                                    // При бесконечной прокрутке возвращается к первому слайду,если пытаются пролистать после последнего слайда.
        index = 0;
        fast = true;
      } else if (index < 0) {                                                                      // При бесконечной прокрутке перемещается к последнему слайду,если пытаются пролистать до первого слайда.
        index = this.slideElements.length - this.slidesPerView;
        fast = true;
      }
    } else {                                                                                       // Ограничивает индекс допустимыми значениями.
      index = Math.max(0, Math.min(index, this.slideElements.length - this.slidesPerView));
      fast = false
    }
  
    this.slideIndex = index;                                                                       // Обновляет текущий индекс слайда.
    this.updateSliderPosition(fast);                                                                   // Обновляет позицию слайдера.
  }
  
  /**
   * Запускает автоматический переход слайдов.
   */
  private startAutoplay(): void {
    if (!this.slideElements || this.slideElements.length === 0) {
      console.warn('Cannot start autoplay: no slides available');                                  // Предупреждение, если слайды отсутствуют.
      return;
    }
  
    if (this.autoplayInterval) return;                                                             // Защита от повторного запуска автоплея.
  
    this.infinity = true;                                                                          // При автоплеи всегда включается бесконечная прокрутка.
    this.autoplayInterval = setInterval(() => {                                                    // Переходит к следующей группе слайдов.
      this.goToSlide(this.slideIndex + this.slidesPerView);
    }, this.autoplayTime * 1000);
  }

  /**
   * Останавливает автоплей.
   */
  private stopAutoplay(): void {
    if (this.autoplayInterval && this.autoplay) {
      clearInterval(this.autoplayInterval);                                                        // Останавливает интервал автоплея.
      this.autoplayInterval = null;
    }
  }

  /**
   * Вызывается при движении пальца по экрану (touchmove).
   * - Проверяется количество пальцев (event.touches.length), чтобы избежать некорректной работы при многопальцевых жестах.
   * - Если жест выполняется одним пальцем, вызывается метод handleGestureMove для обработки движения.
   * @param event TouchEvent
  */
  private onTouchMove(event: TouchEvent): void {
    if (event.touches.length > 1) return;                                                          // Если используется больше одного пальца, игнорируем событие (защита от многопальцевых жестов).
    this.handleGestureMove(event.touches[0].clientX, event.touches[0].clientY);                    // Передаем координаты первого пальца в метод обработки движения.
  }

  /**
   * Вызывается при завершении жеста (touchend).
      - Вызывает метод onGestureEnd, который обрабатывает логику завершения жеста (например, определяет, нужно ли переключить слайд).
      - Очищает глобальные слушатели событий (touchmove и touchend), чтобы избежать утечек памяти.
      - Сбрасывает ссылки на функции удаления слушателей (touchMoveRemover и touchEndRemover).
   */
  private onTouchEnd(): void {
    this.onGestureEnd();                                                                           // Завершает обработку жеста и обновляет позицию слайдера.
  
    this.touchMoveRemover?.();                                                                     // Удаляет глобальный слушатель для 'touchmove'.
    this.touchEndRemover?.();                                                                      // Удаляет глобальный слушатель для 'touchend'.
    
    this.touchMoveRemover = null;                                                                  // Сбрасывает ссылку на удалитель 'touchmove'.
    this.touchEndRemover = null;                                                                   // Сбрасывает ссылку на удалитель 'touchend'.
  }

  /**
   * Вызывается при движении мыши (mousemove).
      - Передает текущие координаты курсора (clientX и clientY) в метод handleGestureMove для обработки перемещения.
  * @param event MouseEvent
 */
  private onMouseMove(event: MouseEvent): void {
    this.handleGestureMove(event.clientX, event.clientY);                                          // Передает текущие координаты мыши в метод обработки движения.
  }

  /**
   * Вызывается при отпускании мыши (mouseup).
    - Вызывает метод onGestureEnd, который обрабатывает логику завершения жеста (например, определяет, нужно ли переключить слайд).
    - Очищает глобальные слушатели событий (mousemove и mouseup), чтобы избежать утечек памяти.
    - Сбрасывает ссылки на функции удаления слушателей (mouseMoveRemover и mouseUpRemover).
  */
  private onMouseUp(): void {
    this.onGestureEnd();                                                                           // Завершает обработку жеста и обновляет позицию слайдера.
    

    this.mouseMoveRemover?.();                                                                     // Удаляем слушатели для 'mousemove' и 'mouseup'
    this.mouseUpRemover?.();
    
    
    this.mouseMoveRemover = null;                                                                  // Сбрасываем ссылки на удалители
    this.mouseUpRemover = null;
  }
  
  /**
   * Вызывается при начале жеста (touchstart).
    - Останавливает автоплей (stopAutoplay), чтобы пользователь мог управлять слайдером вручную.
    - Вызывает метод handleGestureStart, который сохраняет начальные координаты пальца и готовит слайдер к перемещению.
    - Добавляет глобальные слушатели событий (touchmove и touchend) через Renderer2 для отслеживания движения пальца и завершения жеста.
  * @param event MouseEvent
  */
  private onTouchStart(event: TouchEvent): void {
    this.stopAutoplay();                                                                           // Останавливает автоплей, если он активен, чтобы пользователь мог управлять слайдером вручную.
    this.handleGestureStart(event.touches[0].clientX, event.touches[0].clientY);                   // Сохраняет начальные координаты пальца и начинает обработку жеста.
    
    this.touchMoveRemover = this.renderer.listen(                                                  // Добавляет глобальный слушатель для 'touchmove', чтобы отслеживать движение пальца.
      this.document,
      'touchmove',
      this.onTouchMove.bind(this)
    ); 

    this.touchEndRemover = this.renderer.listen(                                                   // Добавляет глобальный слушатель для 'touchend', чтобы обработать завершение жеста.
      this.document,
      'touchend',
      this.onTouchEnd.bind(this)
    ); 
  }

  /**
   * Метод вызывается при нажатии кнопки мыши (mousedown).
      - Блокирует стандартное поведение браузера (event.preventDefault()), чтобы предотвратить конфликты с другими действиями (например, прокруткой страницы).
      - Останавливает автоплей (stopAutoplay), чтобы пользователь мог управлять слайдером вручную.
      - Вызывает метод handleGestureStart, который сохраняет начальные координаты мыши и готовит слайдер к перемещению.
      - Добавляет глобальные слушатели событий (mousemove и mouseup) через Renderer2 для отслеживания движения мыши и завершения жеста.
   * @param event MouseEvent
   */
  private onMouseDown(event: MouseEvent): void {
    event.preventDefault();                                                                        // Предотвращает стандартное поведение браузера (например, выделение текста или прокрутку страницы).
    this.stopAutoplay();                                                                           // Останавливает автоплей, если он активен, чтобы пользователь мог управлять слайдером вручную.
    this.handleGestureStart(event.clientX, event.clientY);                                         // Сохраняет начальные координаты мыши и начинает обработку жеста.
    
    this.mouseMoveRemover = this.renderer.listen(                                                  // Добавляет глобальный слушатель для 'mousemove', чтобы отслеживать движение мыши.
      this.document,
      'mousemove',
      this.onMouseMove.bind(this)
    ); 
    this.mouseUpRemover = this.renderer.listen(                                                    // Добавляет глобальный слушатель для 'mouseup', чтобы обработать завершение жеста.
      this.document,
      'mouseup',
      this.onMouseUp.bind(this)
    ); 
  }
/**
 * Вызывается при начале жеста (как для touchstart, так и для mousedown).
    - Сохраняет начальные координаты (posInitial, posX1, posY1) для дальнейших расчетов.
    - Сбрасывает флаг isSwiping, чтобы подготовить компонент к новому жесту.
    - Отключает CSS-переходы (transition: none) для элемента трека (sliderTrackRef), чтобы обеспечить плавное перемещение без анимации во время жеста.
    - Изменяет классы у контейнера слайдов (sliderListRef):
    - Удаляет класс grab (обычное состояние).
    - Добавляет класс grabbing (состояние "в процессе перемещения").
 * @param clientX - начальная позиция X
 * @param clientY - начальная позиция Y
 */
  private handleGestureStart(clientX: number, clientY: number): void {
    this.allowTransitions = true;                                                                  // Разрешает CSS-переходы для анимации.
    this.posInitial = this.posX1 = clientX;                                                        // Сохраняет начальную позицию X.
    this.posY1 = clientY;                                                                          // Сохраняет начальную позицию Y.
    this.isSwiping = false;                                                                        // Сбрасывает флаг свайпа, чтобы начать новое движение.
    
    this.renderer.setStyle(                                                                        // Отключает CSS-переходы для трека слайдов, чтобы обеспечить плавное управление во время жеста.
      this.sliderTrackRef.nativeElement,
      'transition',
      'none'
    ); 
    
    this.renderer.removeClass(this.sliderListRef.nativeElement, 'grab');                           // Удаляет класс 'grab' у контейнера слайдов.
    this.renderer.addClass(this.sliderListRef.nativeElement, 'grabbing');                          // Добавляет класс 'grabbing' для стилизации состояния "в процессе перемещения".
  }

  /**
   * Обрабатывает движение пальца/мыши во время жеста.
   * - Обновляет позицию трека слайдов.
   * - Ограничивает движение в пределах доступных слайдов.
   * - Обновляет позицию трека слайдов.
   * @param clientX - текущая позиция X
   * @param clientY - текущая позиция Y
   */
  private handleGestureMove(clientX: number, clientY: number): void {
    const currentTransform = this.getCurrentTransform();                                           // Получает текущее смещение слайдера.
    let newTransform = currentTransform - (this.posX1 - clientX);                                  // Рассчитывает новое смещение.
    this.posX2 = this.posX1 - clientX;                                                             // Вычисляем разницу между предыдущей и текущей позицией X
    this.posX1 = clientX;                                                                          // Обновляем текущую позицию X
    this.posY2 = this.posY1 - clientY;                                                             // Вычисляем разницу между предыдущей и текущей позицией Y
    this.posY1 = clientY;                                                                          // Обновляем текущую позицию Y
    const maxOffset =
      (this.slideElements.length - this.slidesPerView) *
      (this.slideWidth + this.gap);                                                                // Максимальное смещение слайдера.

    newTransform = Math.max(-maxOffset, Math.min(0, newTransform));                                // Ограничивает движение в пределах доступных слайдов.

    this.renderer.setStyle(                                                                        // Обновляет позицию трека слайдов.
      this.sliderTrackRef.nativeElement,
      'transform',
      `translate3d(${newTransform}px, 0px, 0px)`
    ); 
  }

  /**
   * Завершает обработку жеста.
   * - Вычисляет разницу между начальной и конечной позицией.
   * - Сбрасывает флаг свайпа.
   * - Определяет, нужно ли перейти к следующей или предыдущей группе слайдов.
   * - Возвращается к текущей позиции, если движение недостаточно для смены слайда.
   * - Возобновляет автоплей после завершения жеста.
   */
  private onGestureEnd(): void {
    const posFinal = this.posInitial - this.posX1;                                                 // Вычисляет разницу между начальной и конечной позицией.
    this.isSwiping = false;                                                                        // Сбрасывает флаг свайпа.

    const posThreshold = this.slideWidth * 0.35;                                                   // Пороговое значение для смены слайда.

    if (Math.abs(posFinal) > posThreshold) {
      if (posFinal > 0) {
        this.goToSlide(this.slideIndex + this.slidesPerView);                                      // Переходит к следующей группе слайдов.
      } else {
        this.goToSlide(this.slideIndex - this.slidesPerView);                                      // Переходит к предыдущей группе слайдов.
      }
    } else {
      this.updateSliderPosition();                                                                 // Возвращается к текущей позиции, если движение недостаточно большое.
    }

    if (this.autoplay) {
      this.startAutoplay();                                                                        // Возобновляет автоплей после завершения жеста.
    }
    this.renderer.addClass(this.sliderListRef.nativeElement, 'grab');                              // Добавляет класс 'grab' у контейнера слайдов.
    this.renderer.removeClass(this.sliderListRef.nativeElement, 'grabbing');                       // Удаляет класс 'grabbing' для стилизации состояния "в процессе перемещения".
  }

  /**
   * Получает текущее смещение трека слайдов.
   */
  private getCurrentTransform(): number {
    const style = this.sliderTrackRef.nativeElement.style.transform;
    return +(style.match(this.trfRegExp)?.[0] || '0'); // Извлекает числовое значение из строки transform.
  }

  /**
   * Обновляет текущую позицию слайдера.
   * - Разрешает CSS-переходы.
   * - Рассчитывает смещение слайдера.
   * - Добавляет анимацию для перемещения трека.
   * - Обновляет позицию трека.
   * @param fast:boolean - быстрый переход
   */
  private updateSliderPosition(fast: boolean = false): void {
    this.allowTransitions = true;                                                                  // Разрешает CSS-переходы.

    const offset = this.calculateOffset();                                                         // Рассчитывает смещение слайдера.

    if (this.allowTransitions) {
      if (fast) {
        this.renderer.setStyle(
          this.sliderTrackRef.nativeElement,
          'transition',
          'none'
        );                                                                                         // Отключает анимацию для быстрого перехода.
      } else {
      this.renderer.setStyle(
        this.sliderTrackRef.nativeElement,
        'transition',
        'transform 0.3s'
      );                                                                                           // Добавляет анимацию для перемещения трека.
    }

    this.renderer.setStyle(                                                                        // Обновляет позицию трека.
      this.sliderTrackRef.nativeElement,
      'transform',
      `translate3d(-${offset}px, 0px, 0px)`
    ); 

    this.updateArrowState();                                                                       // Обновляет состояние кнопок "Предыдущий" и "Следующий".
    this.updateActiveDot();                                                                        // Обновляет активную точку навигации.
    this.cdr.detectChanges();                                                                      // Оповещает Angular о необходимости обновления представления.
  }
  }
  /**
   * Рассчитывает смещение трека слайдов.
   * - Расчитывает общую ширину всех слайдов.
   * - Расчитывает ширину контейнера слайдов.
   * - Расчитывает максимальное смещение трека.
   * - Ограничивает смещение максимального значения
   */
  private calculateOffset(): number {
    let offset = this.slideIndex * (this.slideWidth + this.gap);                                   // Рассчитывает смещение.

    if (!this.offsetCache) {
      const totalSlidesWidth =
        this.slideElements.length * (this.slideWidth + this.gap) - this.gap;                       // Общая ширина всех слайдов.
      const sliderListWidth = this.sliderListRef.nativeElement.offsetWidth;                        // Ширина контейнера слайдов.

      this.offsetCache = {
        totalSlidesWidth,
        sliderListWidth,
        maxOffset:
          (this.slideElements.length - this.slidesPerView) *
          (this.slideWidth + this.gap),                                                            // Максимальное смещение трека.
      };
    }

    if (this.offsetCache.totalSlidesWidth <= this.offsetCache.sliderListWidth) {
      offset = 0;                                                                                  // Если все слайды помещаются в контейнер, смещение равно 0.
    } else {
      offset = Math.min(offset, this.offsetCache.maxOffset);                                       // Ограничивает смещение максимальным значением.
    }

    return offset;
  }

  /**
   * Обновляет состояние кнопок "Предыдущий" и "Следующий".
   * - Проверяет, является ли текущий слайд первым или последним.
   * - Обновляет состояние кнопок "Предыдущий" и "Следующий".
   */
  private updateArrowState(): void {
    if (!this.prevArrowRef || !this.nextArrowRef) return;

    const isFirstSlide = this.slideIndex === 0;                                                    // Проверяет, является ли текущий слайд первым.
    const isLastSlide =
      this.slideIndex >= this.slideElements.length - this.slidesPerView;                           // Проверяет, является ли текущий слайд последним.

    
    if (isFirstSlide) {                                                                            // Обновляет состояние кнопки "Предыдущий".
      this.renderer.addClass(this.prevArrowRef.nativeElement, 'disabled');
    } else {
      this.renderer.removeClass(this.prevArrowRef.nativeElement, 'disabled');
    }

    
    if (isLastSlide) {                                                                             // Обновляет состояние кнопки "Следующий".
      this.renderer.addClass(this.nextArrowRef.nativeElement, 'disabled');
    } else {
      this.renderer.removeClass(this.nextArrowRef.nativeElement, 'disabled');
    }

    
    if (isFirstSlide) {                                                                            // Обновляет классы для основного контейнера слайдера.
      this.renderer.addClass(this.sliderRef.nativeElement, 'no-prev');
    } else {
      this.renderer.removeClass(this.sliderRef.nativeElement, 'no-prev');
    }

    if (isLastSlide) {
      this.renderer.addClass(this.sliderRef.nativeElement, 'no-next');
    } else {
      this.renderer.removeClass(this.sliderRef.nativeElement, 'no-next');
    }

    this.cdr.markForCheck();                                                                       // Оповещает Angular о необходимости проверки изменений.
  }

  /**
   * Обработчик клика на кнопку "Предыдущий".
   * - Останавливает автоплей при ручном управлении.
   * - Переходит к предыдущей группе слайдов.
   */
  private onPrevClick(): void {
    this.stopAutoplay();                                                                          // Останавливает автоплей при ручном управлении.
    this.goToSlide(this.slideIndex - this.slidesPerView);                                         // Переходит к предыдущей группе слайдов.
  }

  /**
   * Обработчик клика на кнопку "Следующий".
   * - Останавливает автоплей при ручном управлении.
   * - Переходит к следующей группе слайдов.
   */
  private onNextClick(): void {
    this.stopAutoplay();                                                                         // Останавливает автоплей при ручном управлении.
    this.goToSlide(this.slideIndex + this.slidesPerView);                                        // Переходит к следующей группе слайдов.
  }

 /**
   * Удаляет все слушатели событий при уничтожении компонента.
   * - Очищает интервал автоплея.
   * - Удаляет слушатели для 'touchstart' и 'mousedown'.
   * - Удаляет слушатели для 'touchmove', 'touchend', 'mousemove' и 'mouseup'.
   * - Удаляет слушатели для кнопок "Предыдущий" и "Следующий".
   * - Удаляет слушатели для точек навигации.
   */
 ngOnDestroy(): void {
  this.stopAutoplay();                                                                           // Очищает интервал автоплея.

  
  [this.touchStartRemover, this.mouseDownRemover].forEach((remover) =>                           // Удаляет слушатели для 'touchstart' и 'mousedown'.
    remover?.()
  );

  
  [this.touchMoveRemover,                                                                        // Удаляет слушатели для 'touchmove', 'touchend', 'mousemove' и 'mouseup'.
    this.touchEndRemover, 
    this.mouseMoveRemover, 
    this.mouseUpRemover].forEach(
    (remover) => remover?.()
  );

  if (this.prevArrowClickRemover) this.prevArrowClickRemover();                                  // Удаляет слушатель для кнопки "Предыдущий".
  if (this.nextArrowClickRemover) this.nextArrowClickRemover();                                  // Удаляет слушатель для кнопки "Следующий".

  
  this.dotsRemovers.forEach((remover) => remover());                                             // Удаляет слушатели для точек навигации.
}
}
