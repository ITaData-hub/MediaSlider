### README.md

---

# Компонент `MediaViewerSlider` 🎉

Компонент `MediaViewerSlider` представляет собой адаптивный слайдер, который поддерживает управление жестами (свайп) ✨, кнопками ("Предыдущий" и "Следующий") ⬅️➡️, автоплей ⏳ и бесконечную прокрутку ♾️. Он создан с использованием Angular и предоставляет гибкость настройки через входные параметры (`@Input`). Этот слайдер может быть легко интегрирован в любое приложение Angular и поддерживает как фиксированное количество слайдов на экране, так и динамическое содержимое.

[HTML presentation](#основные-возможности)

---

## Оглавление 📋
1. [Основные возможности](#основные-возможности) 🚀
2. [Входные параметры](#входные-параметры) 🔧
3. [Использование](#использование) 💻
4. [Пример использования](#пример-использования) 📝
5. [Методы жизненного цикла](#методы-жизненного-цикла) 🔄
6. [CSS-классы](#css-классы) 🎨
7. [Автоплей](#автоплей) ⏳
8. [Бесконечная прокрутка](#бесконечная-прокрутка) ♾️
9. [Точки навигации](#точки-навигации) 🔘
10. [Кнопки управления](#кнопки-управления) ⬅️➡️

---

## Основные возможности 🚀
- **Управление жестами** 👌: Поддерживает свайп для мобильных устройств и перетаскивание для десктопных.
- **Адаптивность** 📱💻: Автоматически подстраивается под ширину контейнера и отображает нужное количество слайдов.
- **Автоплей** ⏳: Включает автоматическую прокрутку слайдов с заданным интервалом времени.
- **Бесконечная прокрутка** ♾️: Позволяет бесконечно прокручивать слайды, переходя от последнего к первому и наоборот.
- **Точки навигации** 🔘: Предоставляет возможность переключать слайды через точки.
- **Кастомизация** ✨: Поддерживает настройку стилей, количества слайдов на экране, отступов между слайдами и скрытия элементов управления.

---

## Входные параметры 🔧
| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `gap` | `number` | `0` | Отступ между слайдами (в пикселях). Защита от отрицательных значений. 📐 |
| `slidesPerView` | `number` | `1` | Количество слайдов, отображаемых одновременно. Минимальное значение `1`. 📊 |
| `clientSlideWidth` | `number` | `0` | Ширина каждого слайда (если задана). Используется для квадратных слайдов. 🟩 |
| `hideArrows` | `boolean` | `false` | Скрывает кнопки "Предыдущий" и "Следующий" ❌⬅️➡️ |
| `hideDots` | `boolean` | `false` | Скрывает точки навигации ❌DOTS |
| `dotsInside` | `boolean` | `false` | Размещает точки навигации внутри слайдера INSIDE-DOTS |
| `arrowsInside` | `boolean` | `false` | Размещает кнопки "Предыдущий" и "Следующий" внутри слайдера INSIDE-ARROWS |
| `squareSlide` | `boolean` | `false` | Если `true`, слайды будут иметь квадратную форму SQUARE-SLIDES |
| `autoplay` | `boolean` | `false` | Включение/выключение автоплея AUTOPLAY-ON/OFF |
| `autoplayTime` | `number` | `20` | Интервал времени между автоматическими переходами (в секундах) TIME-INTERVAL |
| `infinity` | `boolean` | `false` | Включение бесконечной прокрутки INFINITY-MODE |

---

## Использование 💻
Для использования компонента добавьте его в HTML-шаблон вашего приложения:
```html
<!-- Пример использования -->
<media-viewer-slider>
  <div>Слайд 1</div>
  <div>Слайд 2</div>
  <div>Слайд 3</div>
  <div>Слайд 4</div>
</media-view-slider>
```

---

## Пример использования 📝
### Базовый пример 🏠
```html
<media-viewer-slider>
  <div>Слайд 1</div>
  <div>Слайд 2</div>
  <div>Слайд 3</div>
  <div>Слайд 4</div>
</media-view-slider>
```

### С автоплеем ⏳
```html
<media-viewer-slider [autoplay]="true" [autoplayTime]="10">
  <div>Слайд 1</div>
  <div>Слайд 2</div>
  <div>Слайд 3</div>
  <div>Слайд 4</div>
</media-view-slider>
```

### Бесконечная прокрутка ♾️
```html
<media-viewer-slider [infinity]="true">
  <div>Слайд 1</div>
  <div>Слайд 2</div>
  <div>Слайд 3</div>
  <div>Слайд 4</div>
</media-view-slider>
```

### Скрытие кнопок и точек ❌
```html
<media-viewer-slider [hideArrows]="true" [hideDots]="true">
  <div>Слайд 1</div>
  <div>Слайд 2</div>
  <div>Слайд 3</div>
</media-view-slider>
```

---

## Методы жизненного цикла 🔄
1. **`ngAfterContentInit`**:
   - Проверяет наличие слайдов (`slideElements`) после загрузки контента.
   - Если слайды отсутствуют, выводит предупреждение `"No slides available"` ⚠️.
2. **`ngAfterViewInit`**:
   - Инициализирует слайдер после полной загрузки DOM-элементов.
   - Вызывает метод `initializeSlider`.
3. **`ngOnDestroy`**:
   - Очищает все добавленные слушатели событий.
   - Останавливает автоплей, если он был запущен STOP-AUTOPLAY.

---

## CSS-классы 🎨
Компонент автоматически добавляет следующие классы для стилизации:
| Класс | Описание |
| --- | --- |
| `no-arrows` | Скрывает кнопки "Предыдущий" и "Следующий" HIDE-ARROWS |
| `no-dots` | Скрывает точки навигации HIDE-DOTS |
| `dots-inside` | Размещает точки навигации внутри слайдера DOTS-INSIDE |
| `arrows-inside` | Размещает кнопки "Предыдущий" и "Следующий" внутри слайдера ARROWS-INSIDE |
| `grab` | Добавляется к контейнеру слайдов при обычном состоянии GRAB |
| `grabbing` | Добавляется к контейнеру слайдов во время перемещения GRABBING |
| `disabled` | Добавляется к кнопкам, если они неактивны (например, на первом или последнем слайде). DISABLED-BUTTON |
| `no-prev` | Добавляется к основному контейнеру слайдера, если достигнут первый слайд. NO-PREV |
| `no-next` | Добавляется к основному контейнеру слайдера, если достигнут последний слайд. NO-NEXT |

---

## Автоплей ⏳
Функциональность автоплея позволяет слайдеру автоматически переходить к следующей группе слайдов через заданный интервал времени.
### Как это работает:
- Если параметр `autoplay` установлен в `true`, слайдер начнет автоматически прокручиваться.
- Интервал времени между переходами задается параметром `autoplayTime` (по умолчанию 20 секунд).
- При автоплеи параметр `infinity` автоматически становится `true`, чтобы обеспечить бесконечную прокрутку.

---

## Бесконечная прокрутка ♾️
При включении параметра `infinity` слайдер будет бесконечно прокручиваться, переходя от последнего слайда к первому и наоборот.
### Как это работает:
- Если пользователь достигает последнего слайда, компонент мгновенно перемещается к первому слайду (и наоборот).
- Перемещение происходит без анимации, чтобы создать иллюзию бесконечной ленты.

---

## Точки навигации 🔘
Точки навигации позволяют пользователям быстро переключаться между группами слайдов.
### Как это работает:
- Каждая точка соответствует группе слайдов (например, если `slidesPerView = 3`, то одна точка управляет тремя слайдами).
- Активная точка получает класс `active`.

---

## Кнопки управления ⬅️➡️
Кнопки "Предыдущий" и "Следующий" позволяют пользователю переключать слайды вручную.
### Как это работает:
- Кнопки становятся неактивными (`disabled`) на первом и последнем слайде.
- При клике на кнопку вызывается метод `goToSlide`.

---


### Пример:
```html
<app-media-viewer-slider [gap]="10" [slidesPerView]="3">
  <div slide>Слайд 1</div>
  <div slide>Слайд 2</div>
  <div slide>Слайд 3</div>
  <div slide>Слайд 4</div>
</app-media-view-slider>
```

---

## Настройка стилей

Компонент использует стратегию обнаружения изменений `ChangeDetectionStrategy.OnPush` и отключает инкапсуляцию стилей (`ViewEncapsulation.None`). Это позволяет использовать глобальные стили для настройки внешнего вида.

---

## Инструкция по пользованию

1. **Добавьте компонент в проект**:
   Убедитесь, что компонент импортирован в ваш модуль:
   ```typescript
   import { MediaViewerSliderComponent } from './path-to/media-viewer-slider.component';
   ```

2. **Передайте слайды**:
   Используйте `<ng-content>` для передачи содержимого:
   ```html
   <app-media-viewer-slider [gap]="10" [slidesPerView]="3">
     <div slide>Содержимое слайда 1</div>
     <div slide>Содержимое слайда 2</div>
     <div slide>Содержимое слайда 3</div>
   </app-media-viewer-slider>
   ```

3. **Настройте параметры**:
   - `gap`: Задайте отступ между слайдами.
   - `slidesPerView`: Укажите количество слайдов, которые нужно показывать одновременно.
   - `autoplay`: Включите автоплей.
   - `infinity`: Включите бесконечную прокрутку.

4. **Стилизуйте компонент**:
   Используйте глобальные стили или добавьте собственные классы для кастомизации внешнего вида.

---

## Логика работы

1. **Инициализация**:
   - Метод `initializeSlider` вызывается после загрузки DOM.
   - Рассчитывает размеры слайдов, устанавливает слушатели событий и создает точки навигации.

2. **Обработка жестов**:
   - Метод `onTouchStart` начинает обработку жеста.
   - Метод `handleGestureMove` обновляет позицию трека слайдов.
   - Метод `onGestureEnd` определяет, нужно ли переключить слайд.

3. **Автоплей**:
   - Метод `startAutoplay` запускает автоматическую прокрутку слайдов.
   - Метод `stopAutoplay` останавливает автоплей при ручном управлении.

4. **Бесконечная прокрутка**:
   - Если параметр `infinity` установлен в `true`, слайдер будет бесконечно прокручиваться.

5. **Точки навигации**:
   - Метод `createDots` создает точки для каждой группы слайдов.
   - Метод `updateActiveDot` обновляет активную точку.

6. **Кнопки управления**:
   - Метод `onPrevClick` переключает слайды назад.
   - Метод `onNextClick` переключает слайды вперед.

---

## Производительность

- **Стратегия обнаружения изменений**: Используется `ChangeDetectionStrategy.OnPush` для минимизации проверок изменений.
- **Кэширование размеров**: Размеры слайдов и контейнера кэшируются для оптимизации производительности.
- **Защитные проверки**: Все ключевые методы содержат проверки на существование элементов, чтобы избежать ошибок.

---

## Советы по использованию

1. **Асинхронная загрузка данных**:
   - Если данные для слайдов загружаются асинхронно, компонент автоматически перезапустит инициализацию после их получения.

2. **Квадратные слайды**:
   - Установите параметр `squareSlide` в `true`, чтобы слайды имели квадратную форму.

3. **Отладка**:
   - Используйте логирование (`console.log`) для диагностики состояния компонента.

---

## Зависимости

- `@angular/core`
- `@angular/common`
- `Renderer2` для безопасной работы с DOM.
- `ChangeDetectorRef` для оповещения Angular о необходимости обновления представления.

---

## Возможные улучшения

1. **Lazy-loading изображений**:
   - Добавьте функционал для загрузки изображений только при необходимости.

2. **Поддержка вертикального свайпа**:
   - Расширьте функциональность для работы с вертикальными жестами.

3. **Анимация переходов**:
   - Добавьте больше вариантов анимации для плавного перехода между слайдами.

---

## Лицензия

Компонент распространяется под MIT License.