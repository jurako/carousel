const SELECTOR_CAROUSEL     = '.carousel';
const SELECTOR_IMAGES_WRAP  = '.images';
const SELECTOR_BC_WRAP      = '.breadcrumbs';
const SElECTOR_NEXT         = '.next';
const SELECTOR_PREV         = '.prev';
const SELECTOR_TRANSITION   = '.transition';
const SELECTOR_ACTIVE       = '.active';
const SELECTOR_ACTIVE_BC    = '.breadcrumb.active';

const CLASS_NAME_NEXT       = 'next';
const CLASS_NAME_PREV       = 'prev';
const CLASS_NAME_MOVE_LEFT  = 'move-left';
const CLASS_NAME_MOVE_RIGHT = 'move-right';
const CLASS_NAME_TRANSITION = 'transition';
const CLASS_NAME_ACTIVE     = 'active';

const TIMEOUT_INTERVAL      = 3000;

class Slider {
    constructor(){
        this.timeoutId = 0;
        this.timeoutInterval = CLASS_NAME_ACTIVE;
        this.defaultDirection = CLASS_NAME_NEXT;
        this.images = document.querySelector(SELECTOR_IMAGES_WRAP);

        document.querySelector(SELECTOR_PREV).addEventListener('click', this.buttonClick.bind(this));
        document.querySelector(SElECTOR_NEXT).addEventListener('click', this.buttonClick.bind(this));
        document.querySelector(SELECTOR_BC_WRAP).addEventListener('click', this.breadcrumbClick.bind(this));
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
        this.direction = event.target.classList.contains(CLASS_NAME_NEXT) ? CLASS_NAME_NEXT : CLASS_NAME_PREV;
        let newActive = null;
        if(this.direction == CLASS_NAME_NEXT) {
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
        this.activeBreadcrumb = document.querySelector(SELECTOR_ACTIVE_BC);
        let activeBreadcrumbIndex = this._getElementIndex(this.activeBreadcrumb.parentNode, this.activeBreadcrumb);
        let breadcrumbIndex = this._getElementIndex(event.target.parentNode, event.target);

        if(breadcrumbIndex == activeBreadcrumbIndex) return;

        this.direction = activeBreadcrumbIndex < breadcrumbIndex ? CLASS_NAME_NEXT : CLASS_NAME_PREV;
        let newActive = this.images.children[breadcrumbIndex];
        this.transition(newActive, this.direction);
    }

    transition(newActive, direction) {
        if(document.querySelectorAll(SELECTOR_TRANSITION).length > 0) return;

        if(direction == CLASS_NAME_NEXT) {

            newActive.classList.add(CLASS_NAME_MOVE_RIGHT);
            this._reflow(newActive);

            this.active.classList.add(CLASS_NAME_TRANSITION);
            newActive.classList.add(CLASS_NAME_TRANSITION);

            this.active.classList.add(CLASS_NAME_MOVE_LEFT);
            newActive.classList.remove(CLASS_NAME_MOVE_RIGHT);
        
        } else {

            newActive.classList.add(CLASS_NAME_MOVE_LEFT);
            this._reflow(newActive);

            this.active.classList.add(CLASS_NAME_TRANSITION);
            newActive.classList.add(CLASS_NAME_TRANSITION);

            this.active.classList.add(CLASS_NAME_MOVE_RIGHT);
            newActive.classList.remove(CLASS_NAME_MOVE_LEFT);

        }
        this.active.classList.remove(CLASS_NAME_ACTIVE);
        newActive.classList.add(CLASS_NAME_ACTIVE);

        this.activeBreadcrumb.classList.remove(CLASS_NAME_ACTIVE);
        this.activeBreadcrumb.parentNode.children[this._getElementIndex(this.images, newActive)].classList.add(CLASS_NAME_ACTIVE);

        let self = this;
        this.images.ontransitionend = function(event) {
            event.target.classList.remove(CLASS_NAME_TRANSITION, CLASS_NAME_MOVE_LEFT, CLASS_NAME_MOVE_RIGHT);

            self.resetTimeout();
        }
    }

    resetTimeout() {
        this.init();
    }
    
    init() {
        clearTimeout(this.timeoutId);
        // this.timeoutId = setTimeout(this.autoPlay.bind(this), this.timeoutInterval);
        this.active = document.querySelector(SELECTOR_ACTIVE);
        this.activeBreadcrumb = document.querySelector(SELECTOR_ACTIVE_BC);
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