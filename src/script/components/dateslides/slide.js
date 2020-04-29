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


        //console.log(this.data)

        let numbers = '';


        //console.log(this.data.infected)


        numbers += `
            <div class="number-element">
                <span class="number-label">Smittet</span>
                <span class="number">${this.data.infected || 0}</span>
            </div>
        `;
        numbers += `
            <div class="number-element">
                <span class="number-label">Indlagt</span>
                <span class="number">${this.data.hospitalized || 0}</span>
            </div>
        `;
        numbers += `
            <div class="number-element">
                <span class="number-label">Intensiv</span>
                <span class="number">${this.data.intensivecare || 0}</span>
            </div>
        `;
        numbers += `
            <div class="number-element">
                <span class="number-label">Døde</span>
                <span class="number">${this.data.dead || 0}</span>
            </div>
        `;
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


        //this.buildSource();

        return this.container;


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