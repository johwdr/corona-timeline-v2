'use strict';

import './slide.scss';

export default class Slide {
    constructor(slidesData, index, navigation) {
        this.slides = slidesData;
        this.data = slidesData[index];
        this.index = index;
        this.navigationTools = navigation;
        return this.build();


    }



    build() {

        let contentsString = '';
        this.container = document.createElement('div');
        this.container.classList.add('dateslide-slide');

        if (this.index === 0) {
            this.container.classList.add('dateslide-slide-first');
        }
        if (this.index === (this.slides.length-1)) {
            this.container.classList.add('dateslide-slide-last');
        }

        this.container.id = 'dateslide-slide-' + this.index;
        this.container.dataset.date =  this.data.date;


        //console.log(this.data)

        let numbers = '';


        //console.log(this.data.infected)

        if (this.data.infected) {
            numbers += `
                <div class="number-element">
                    <div class="number">${this.data.infected}</div>
                    <div class="number-label">Smittet</div>
                </div>
            `;
        }
        if (this.data.hospitalized) {
            numbers += `
                <div class="number-element">
                    <div class="number">${this.data.hospitalized}</div>
                    <div class="number-label">Indlagt</div>
                </div>
            `;
        }
        if (this.data.intensivecare) {
            numbers += `
                <div class="number-element">
                    <div class="number">${this.data.intensivecare}</div>
                    <div class="number-label">På intensiv</div>
                </div>
            `;
        }
        if (this.data.dead) {
            numbers += `
                <div class="number-element">
                    <div class="number">${this.data.dead}</div>
                    <div class="number-label">Døde</div>
                </div>
            `;
        }
        if (numbers) {
            contentsString += `<div class="numbers">${numbers}</div>`;
        }


        if (this.data.headline1) {
            contentsString += `
                <h3 class="headline-element headline-element-1">${this.data.headline1}</h3>
            `;
        }
        if (this.data.text1) {
            contentsString += `
                <div class="text-element text-element-1">${this.data.text1}</div>
            `;
        }
        if (this.data.headline2) {
            contentsString += `
                <h3 class="headline-element headline-element-2">${this.data.headline2}</h3>
            `;
        }
        if (this.data.text2) {
            contentsString += `
                <div class="text-element text-element-2">${this.data.text2}</div>
            `;
        }
        if (this.data.headline3) {
            contentsString += `
                <h3 class="headline-element headline-element-3">${this.data.headline3}</h3>
            `;
        }
        if (this.data.text3) {
            contentsString += `
                <div class="text-element text-element-3">${this.data.text3}</div>
            `;
        }
        this.container.innerHTML = contentsString;


        this.bottomWrapper = document.createElement('div');
        this.bottomWrapper.classList.add('bottom-wrapper');
        this.container.appendChild(this.bottomWrapper)

        //this.buildNavigation()
        //this.buildSource();

        return this.container;


    }
    buildNavigation() {
        this.navigation = document.createElement('div');
        this.navigation.classList.add('navigation');



        this.back = document.createElement('button');
        this.back.classList.add('back-button');
        this.back.innerHTML = `
            <svg version="1.1" id="Lag_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                viewBox="0 0 30 35" style="enable-background:new 0 0 30 35;" xml:space="preserve">
                <g>
                    <polygon class="arrow-svg" points="30,35 30,0 0,17.5 	"/>
                </g>
            </svg>`;
        if (this.index != 0) {
            this.back.addEventListener('click', e => {
                this.navigationTools.goBack();
            })
        }





        this.forward = document.createElement('button');
        this.forward.classList.add('forward-button');
        this.forward.innerHTML = `

            <svg version="1.1" id="Lag_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                viewBox="0 0 30 35" style="enable-background:new 0 0 30 35;" xml:space="preserve">
                  <g>
                    <polygon class="arrow-svg" points="0,0 0,35 30,17.5 	"/>
                </g>
            </svg>
            `;
        if (this.index != (this.slides.length-1)) {
            this.forward.addEventListener('click', e => {
                this.navigationTools.goForward();
            })
        }

        this.navigationInner = document.createElement('div');
        this.navigationInner.classList.add('navigation-inner');
        this.navigation.appendChild(this.navigationInner)

        this.navigationInner.appendChild(this.back)
        this.navigationInner.appendChild(this.forward)

        this.bottomWrapper.appendChild(this.navigation)
    }
    buildSource() {


        this.source = document.createElement('div');
        this.source.classList.add('source')
        this.bottomWrapper.appendChild(this.source)
        if (this.data.sources) {
            this.source.innerText = 'Kilde: ' + this.data.sources
        }
    }

}