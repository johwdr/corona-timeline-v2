'use strict';

import './indicator.scss';

const markerWidth = 16;

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

    isSafari() {
        const uA = navigator.userAgent;
        const vendor = navigator.vendor;
        return (/Safari/i.test(uA) && /Apple Computer/.test(vendor) && !/Mobi|Android/i.test(uA));
    }

    build() {


        this.label = document.createElement('div');
        this.label.classList.add('indicator-marker-label');

        this.outerContainer.appendChild(this.label);

        this.line = document.createElement('div');
        this.line.classList.add('indicator-line');
        this.container.appendChild(this.line)
        this.isDown = false;

        this.container.addEventListener("scroll", (event) => {

            if (this.scrolling) return;

            const activeSlide = Math.ceil((event.srcElement.scrollLeft / (markerWidth+2)));
            clearTimeout(this.debounce);
            this.debounce = setTimeout(() => {
                if (activeSlide < this.slides.length) {

                    this.setActiveSlide(activeSlide)
                }

            }, 20)
            console.log();
        }, { passive: true });




        this.container.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.isDown = true;
            this.container.classList.add('active');
            if (!this.isSafari()) {
                console.log('not safari')
                this.container.classList.add('no-snap');
            }
            this.startX = e.pageX - this.container.offsetLeft;
            this.scrollLeft = this.container.scrollLeft;
        });
        this.container.addEventListener('mouseleave', () => {
            this.isDown = false;
            this.container.classList.remove('active');

            this.snapAdjust();
            if(!this.isSafari()) {
                console.log('not safari')
                this.container.classList.remove('no-snap');
            }

        });
        this.container.addEventListener('mouseup', () => {
            this.isDown = false;
            this.container.classList.remove('active');
            this.snapAdjust();
            if(!this.isSafari()) {
                console.log('not safari')
                this.container.classList.remove('no-snap');
            }
            //console.dir(this.container.scrollLeft)
        });
        this.container.addEventListener('mousemove', (e) => {
            if (!this.isDown) return;
            e.preventDefault();
            const x = e.pageX - this.container.offsetLeft;
            const walk = (x - this.startX) * 3; //scroll-fast
            this.container.scrollLeft = this.scrollLeft - walk;
            //console.log(walk);
        });







        console.log(this.slides)
        let currentMonth = null;

        const markerStatic = document.createElement('div');
        markerStatic.classList.add('indicator-marker');
        markerStatic.classList.add('indicator-marker-static');
        this.outerContainer.appendChild(markerStatic)

        this.slides.forEach((slide, index) => {
            const dateArray = slide.date.split('-');
            const month = Number(dateArray[1]);
            const monthText = this.months[month - 1];
            const day = Number(dateArray[0]);
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



            marker.title = `${day}. ${monthText}`;
            /*
            const markerLabel = document.createElement('div');
            markerLabel.classList.add('marker-tooltip')
            markerLabel.innerHTML = `${day}. ${monthText}`;

            marker.appendChild(markerLabel) */



            this.container.appendChild(marker)
            this.markers.push(marker)

        })
        const marker = document.createElement('div');
        marker.classList.add('indicator-marker');
        marker.classList.add('indicator-marker-spacer');

        marker.style.width = (window.innerWidth > 700) ? '700px' : (window.innerWidth-40) + 'px' ;


        this.container.appendChild(marker)
        this.setActiveSlide(0, false)



    }
    snapAdjust() {
        console.log('snap adjust')
        const between = (this.container.scrollLeft % (markerWidth + 2));
        console.log('between: ' + between)
        console.log('scrollLeft: ' + this.container.scrollLeft)
        if (between < 10) {
            this.container.scrollLeft -= between
        } else {
            this.container.scrollLeft += (markerWidth + 2) - between
        }
    }
    moveIndicator(slide, callback = false) {
        let currentScroll = this.container.scrollLeft;
        const xFactor = (slide > this.currentActiveSlide) ? 2 : -2;
        let move = ((slide - this.currentActiveSlide) * markerWidth + xFactor);
        currentScroll += move;
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

        let highlight = '';
        if (this.slides[slide].highlight && this.slides[slide].highlight.length > 0) {
            highlight = '<span class="highlight-label">Nøgledato</span>'
        }

        this.label.innerHTML = `${day}. ${month} ${highlight}`;
        if (callback) {
            this.callback(slide)
        }

    }

    easeInOutQuad(t, b, c, d) {

        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    };
}


