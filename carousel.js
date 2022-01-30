const CAROUSEL_SELECTOR    = '.carousel';
const IMAGES_WRAP_SELECTOR = '.images';
const NEXT_SElECTOR        = '.next';
const PREV_SELECTOR        = '.prev';
const HIDE_RIGHT_SELECTOR  = '.move-right';
const HIDE_LEFT_SELECTOR   = '.move-left';
const TRANSITION_SELECTOR  = '.transition';
const ACTIVE_SELECTOR      = '.active';
const ACTIVE_BC_SELECTOR   = '.breadcrumb.active';

const TIMEOUT_INTERVAL     = 3000;

class Slider {
    constructor(){
        this.timeoutId = 0;
        this.timeoutInterval = 3000;
        this.defaultDirection = 'next';
        this.images = document.querySelector('.images');

        document.querySelector('.prev').addEventListener('click', this.buttonClick.bind(this));
        document.querySelector('.next').addEventListener('click', this.buttonClick.bind(this));
        document.querySelector('.breadcrumbs').addEventListener('click', this.breadcrumbClick.bind(this));
    }

    autoPlay() {
        this.direction = this.defaultDirection;
        let newActive = this.active.nextElementSibling;
        if(!newActive) {
            newActive = this.images.firstElementChild;
        }

        this.transition(newActive, this.direction);
    }

    buttonClick(event) {
        this.direction = event.target.classList.contains('next') ? 'next' : 'prev';
        let newActive = null;
        if(this.direction == 'next') {
            newActive = this.active.nextElementSibling;
            if(!newActive) {
                newActive = this.images.firstElementChild;
            }
        } else {
            newActive = this.active.previousElementSibling;
            if(!newActive) {
                newActive = this.images.lastElementChild;
            }
        }
        this.transition(newActive, this.direction);
    }

    breadcrumbClick(event) {
        this.activeBreadcrumb = document.querySelector('.breadcrumb.active');
        let activeBreadcrumbIndex = this._getElementIndex(this.activeBreadcrumb.parentNode, this.activeBreadcrumb);
        let breadcrumbIndex = this._getElementIndex(event.target.parentNode, event.target);

        if(breadcrumbIndex == activeBreadcrumbIndex) return;

        this.direction = activeBreadcrumbIndex < breadcrumbIndex ? 'next' : 'prev';
        let newActive = this.images.children[breadcrumbIndex];
        this.transition(newActive, this.direction);
    }

    transition(newActive, direction) {
        if(document.querySelectorAll('.transition').length > 0) return;

        if(direction == 'next') {

            newActive.classList.add('move-right');
            this._reflow(newActive);

            this.active.classList.add('transition');
            newActive.classList.add('transition');

            this.active.classList.add('move-left');
            newActive.classList.remove('move-right');
        
        } else {

            newActive.classList.add('move-left');
            this._reflow(newActive);

            this.active.classList.add('transition');
            newActive.classList.add('transition');

            this.active.classList.add('move-right');
            newActive.classList.remove('move-left');

        }
        this.active.classList.remove('active');
        newActive.classList.add('active');

        this.activeBreadcrumb.classList.remove('active');
        this.activeBreadcrumb.parentNode.children[this._getElementIndex(this.images, newActive)].classList.add('active');

        let self = this;
        this.images.ontransitionend = function(event) {
            event.target.classList.remove('transition', 'move-left', 'move-right');

            self.resetTimeout();
        }
    }

    resetTimeout() {
        this.init();
    }
    
    init() {
        clearTimeout(this.timeoutId);
        // this.timeoutId = setTimeout(this.autoPlay.bind(this), this.timeoutInterval);
        this.active = document.querySelector('.active');
        this.activeBreadcrumb = document.querySelector('.breadcrumb.active');
    }

    _getElementIndex(parentNode, element) {
        return Array.prototype.indexOf.call(parentNode.children, element);
    }

    _reflow(element) {
        getComputedStyle(element).getPropertyValue('left');
    }
}

export default Slider;
// let slider = new Slider;
// slider.init();