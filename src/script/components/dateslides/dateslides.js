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

        this.header = document.createElement('div');
        this.header.id = 'corona-timeline-header';

        this.title = document.createElement('h1');
        this.header.appendChild(this.title)




        el.appendChild(this.header)

        this.container = document.createElement('div');
        this.container.id = 'corona-timeline-content';
        el.appendChild(this.container)


        this.credits = document.createElement('div');
        this.credits.id = 'corona-timeline-credits';

        this.container.appendChild(this.credits)

        this.currentSlideIndex = 0;
        this.dataURL = el.dataset.dateSlides;


        const pingvinNamespace = ('drn-corona-timeline-v2');

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




            });


        if (el.dataset.dateConfiguration) {
            this.fetchData(el.dataset.dateConfiguration)
                .then((response) => {
                    //console.log(response);
                    this.configData = response.data[0];

                    this.title.innerHTML = this.configData.header;
                    console.log(this.configData)

                    this.credits.innerHTML = this.configData.credits;

                })

        }


    }


    fetchData(url) {
        return fetch(url)
            .then((data) => { return data.json() });
    }

    build() {

        this.indicator = new Indicator(this.data, (slide) => {
            this.setActiveSlide(slide)
        })
        this.container.appendChild(this.indicator.outerContainer);

        this.buildNavigation().then(() => {
            console.log('hopa')
            this.header.appendChild(this.navigation)

        })

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

            this.indicator.moveIndicator(this.currentSlideIndex - 1, true)
        }
    }
    goForward() {
        if (this.currentSlideIndex < (this.slides.length-1)) {
            this.pingvin.ping('forward')
            if (!this.firstForward) {
                this.pingvin.ping('first-forward');
                this.firstForward = true;
            }

            this.indicator.moveIndicator(this.currentSlideIndex+1, true)
        }
    }
    setActiveSlide(newSlideIndex) {

        this.slides[this.currentSlideIndex].classList.remove('dateslides-slide-active')
        this.slides[newSlideIndex].classList.add('dateslides-slide-active')
        this.currentSlideIndex = newSlideIndex;

        //this.indicator.setCurrentIndex(this.currentSlideIndex)

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
    buildNavigation() {

        return new Promise((resolve, reject) => {


            this.navigation = document.createElement('div');
            this.navigation.classList.add('navigation');



            this.back = document.createElement('button');
            this.back.classList.add('back-button');
            this.back.innerHTML = `
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                    <style type="text/css">

                        .arrow {fill:#FFFFFF;}
                    </style>
                    <g>

                        <polygon class="arrow" points="27.95,36.07 30.07,33.95 21.12,25 30.07,16.05 27.95,13.93 16.87,25 	"/>
                    </g>
                </svg>`;

                this.back.addEventListener('click', e => {

                    this.goBack();

                })






            this.forward = document.createElement('button');
            this.forward.classList.add('forward-button');
            this.forward.innerHTML = `

                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                        viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                    <style type="text/css">
                        .arrow {fill:#FFFFFF;}
                    </style>
                    <g>
                        <polygon class="arrow" points="22.05,36.07 19.93,33.95 28.88,25 19.93,16.05 22.05,13.93 33.13,25 	"/>
                    </g>
                </svg>
                `;

            this.forward.addEventListener('click', e => {
                this.goForward();
            })

            this.navigationInner = document.createElement('div');
            this.navigationInner.classList.add('navigation-inner');
            this.navigation.appendChild(this.navigationInner)

            this.navigationInner.appendChild(this.back)
            this.navigationInner.appendChild(this.forward)
            resolve();
        })


    }
}