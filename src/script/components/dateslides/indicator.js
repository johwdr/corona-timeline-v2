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

            const activeSlide = Math.ceil((event.srcElement.scrollLeft / (markerWidth+2)));
            clearTimeout(this.debounce);
            this.debounce = setTimeout(() => {
                this.setActiveSlide(activeSlide)

            }, 10)
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
            console.log()
            this.container.appendChild(marker)
            this.markers.push(marker)

        })




    }
    moveIndicator(slide) {
        let currentScroll = this.container.scrollLeft;
        currentScroll += (slide - this.currentActiveSlide) * markerWidth;
        this.container.scrollLeft = currentScroll;
        this.setActiveSlide(slide, false)

    }
    setActiveSlide(slide, callback = true) {


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

}