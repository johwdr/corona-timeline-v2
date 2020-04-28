'use strict';

import './indicator.scss';

const markerWidth = 12;

export default class Indicator {
    constructor(slidesData, callback) {
        this.slides = slidesData.reverse();
        this.outerContainer = document.createElement('div');
        this.outerContainer.classList.add('indicator-container');

        this.container = document.createElement('div');
        this.container.classList.add('indicator');

        this.outerContainer.appendChild(this.container)

        this.markers = [];
        this.callback = callback;
        this.currentActiveSlide = 0;
        this.months = ["januar", "februar", "marts", "april", "maj", "juni", "juli", "august", "september", "oktober", "november", "december"];
        this.build();
        this.debounce = null;

    }



    build() {


        this.label = document.createElement('div');
        this.label.classList.add('indicator-marker-label');

        this.outerContainer.appendChild(this.label);

        this.line = document.createElement('div');
        this.line.classList.add('indicator-line');
        this.container.appendChild(this.line)


        this.container.addEventListener("scroll", (event) => {

            if (this.scrolling) return;

            const activeSlide = Math.ceil((event.srcElement.scrollLeft / (markerWidth+2)));
            clearTimeout(this.debounce);
            this.debounce = setTimeout(() => {
                if (activeSlide < this.slides.length) {

                    this.setActiveSlide(activeSlide)
                }

            }, 100)
            console.log();
        }, { passive: true });


        console.log(this.slides)
        let currentMonth = null;

        this.slides.forEach((slide, index) => {
            const dateArray = slide.date.split('-');
            const month = Number(dateArray[1]);
            const marker = document.createElement('div');
            marker.classList.add('indicator-marker');
            if (index === this.currentActiveSlide) {
                marker.classList.add('indicator-marker-active');
            }
            console.log(slide, slide.highlight)
            if (slide.highlight) {
                marker.classList.add('indicator-marker-highlight');
            }
            marker.style.width = markerWidth + 'px'
            marker.dataset.date = slide.date;
            marker.dataset.index = index;
            if (index === this.slides.length-1) {
                marker.classList.add('indicator-marker-last');
            }

            if (month != currentMonth) {
                marker.classList.add('indicator-marker-month');
                const monthLabel = document.createElement('div');
                if (currentMonth != null) {

                    monthLabel.innerHTML = this.months[month-1];
                }
                currentMonth = month;
                monthLabel.classList.add('indicator-marker-month-label');
                marker.appendChild(monthLabel);
            }
            marker.addEventListener('click', () => {
                console.log(marker.dataset.index)
                this.moveIndicator(marker.dataset.index, true);

            })
            console.log()
            this.container.appendChild(marker)
            this.markers.push(marker)

        })
        const marker = document.createElement('div');
        marker.classList.add('indicator-marker');
        marker.classList.add('indicator-marker-spacer');
        this.container.appendChild(marker)
        this.setActiveSlide(0, false)



    }
    moveIndicator(slide, callback = false) {
        let currentScroll = this.container.scrollLeft;
        currentScroll += (slide - this.currentActiveSlide) * markerWidth;
        //this.container.scrollLeft = currentScroll;
        this.scrolling = true;
        //this.container.classList.add('no-snap')
        const duration = (Math.abs((slide - this.currentActiveSlide)) * 100) + 100;
        this.scrollTo(this.container, currentScroll, duration, () => {
            //this.container.classList.remove('no-snap')
            this.scrolling = false;
            this.setActiveSlide(slide, callback)
        })
        //this.setActiveSlide(slide, callback)

    }
    scrollTo(element, to = 0, duration = 1000, scrollToDone = null) {
        const start = element.scrollLeft;
        const change = to - start;
        const increment = 10;
        let currentTime = 0;

        const animateScroll = (() => {

            currentTime += increment;

            const val = this.easeInOutQuad(currentTime, start, change, duration);

            element.scrollLeft = val;

            if (currentTime < duration) {
                setTimeout(animateScroll, increment);
            } else {
                if (scrollToDone) scrollToDone();
            }
        });

        animateScroll();
    }
    setActiveSlide(slide, callback = true) {

        if (this.scrolling) return

        this.markers[this.currentActiveSlide].classList.remove('indicator-marker-active');
        this.currentActiveSlide = slide;
        this.markers[this.currentActiveSlide].classList.add('indicator-marker-active');

        const date = this.slides[slide].date;

        const dateArray = date.split('-');
        const month = this.months[Number(dateArray[1])-1];
        const day = Number(dateArray[0]);
        this.label.innerHTML = `${day}. ${month}`;
        if (callback) {
            this.callback(slide)
        }

    }
    setCurrentIndex(index) {
    }
    easeInOutQuad(t, b, c, d) {

        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    };
}


