'use strict';

import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch'
import '../../utils/findindex'
import './dateslides.scss';

import Pingvin from "./../pingvin/pingvin";
import Slide from "./slide";
import Indicator from "./indicator";
//import Navigation from "./navigation";

export default class DateSlides {
    constructor() {


        const el = document.querySelector('[data-date-slides]');

        this.header = document.createElement('h1');

        el.appendChild(this.header)
        this.container = el;
        this.currentSlideIndex = 0;
        this.dataURL = el.dataset.dateSlides;


        const pingvinNamespace = ('drn-corona-timeline');

        const pingvinURL = 'https://pingvin-server.public.prod.gcp.dr.dk'
        this.pingvin = new Pingvin(pingvinNamespace, pingvinURL)


        console.log(this.dataURL);




        this.fetchData(this.dataURL)
            .then((response) => {
                //console.log(response);
                this.data = response.data;

                return this.build();

            })
            .then(() => {


                if ('date' in el.dataset && el.dataset.date) {
                    const currentDate = el.dataset.date;

                    this.setActiveSlideByDate(currentDate)
                    console.log(this.currentDate)
                } else {
                    this.setActiveSlide(0)
                }

                this.setupEvents();


            });


        if (el.dataset.dateConfiguration) {
            this.fetchData(el.dataset.dateConfiguration)
                .then((response) => {
                    //console.log(response);
                    this.configData = response.data[0];

                    this.header.innerText = this.configData.header;
                    console.log(this.configData)


                })

        }


    }
    setupEvents() {

        document.addEventListener('keyup', (event) => {
            if (event.which === 37) {
                this.goBack()
            }
            if (event.which === 39) {
                this.goForward()
            }
        })

    }

    fetchData(url) {
        return fetch(url)
            .then((data) => { return data.json() });
    }

    build() {

        this.date = document.createElement('div');
        this.date.classList.add('date')
        this.container.appendChild(this.date);


        this.indicator = new Indicator(this.data, (slide) => {
            this.setActiveSlide(slide)
        })
        this.container.appendChild(this.indicator.outerContainer);


        return new Promise((resolve, reject) => {
            this.slides = [];

            this.data.forEach((slideData, index) => {



                const slide = new Slide(this.data, index, {
                    goForward: () => { this.goForward() },
                    goBack: () => { this.goBack() }
                });

                this.slides.push(slide);
                this.container.appendChild(slide);
            });

            resolve();
        })
    }

    goBack() {
        if (this.currentSlideIndex > 0) {
            this.pingvin.ping('back')
            if (!this.firstBack) {
                this.pingvin.ping('first-back');
                this.firstBack = true;
            }
            this.setActiveSlide(this.currentSlideIndex-1)
            this.indicator.moveIndicator(this.currentSlideIndex - 1)
        }
    }
    goForward() {
        if (this.currentSlideIndex < (this.slides.length-1)) {
            this.pingvin.ping('forward')
            if (!this.firstForward) {
                this.pingvin.ping('first-forward');
                this.firstForward = true;
            }
            this.setActiveSlide(this.currentSlideIndex+1)
            this.indicator.moveIndicator(this.currentSlideIndex+1)
        }
    }
    setActiveSlide(newSlideIndex) {
        console.log('set active slide')
        this.slides[this.currentSlideIndex].classList.remove('dateslides-slide-active')
        this.slides[newSlideIndex].classList.add('dateslides-slide-active')
        this.currentSlideIndex = newSlideIndex;
        this.date.innerText = this.formatDate(this.data[newSlideIndex].date);
        this.indicator.setCurrentIndex(this.currentSlideIndex)

    }

    setActiveSlideByDate(currentDate) {

        const currentSlideIndex = this.data.findIndex(slide => slide.date === currentDate);

        if (currentSlideIndex > -1) {
            this.setActiveSlide(currentSlideIndex);
        }
    }


    formatDate(date) {

        const months = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'];
        const split = date.split('-');
        if (split.length === 3) {
            const [day, month, year] = split;
            return Number(day) + '. ' + months[Number(month)-1];
        } else {
            return date;
        }

    }
}