class Slider {
    constructor(){
        this.timeoutId = 0;
        this.timeoutInterval = 3000;
        this.defaultDirection = 'next';
        this.images = document.querySelector('.images');

        document.querySelector('.previous').addEventListener('click', this.buttonClick.bind(this));
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
        this.direction = event.target.classList.contains('next') ? 'next' : 'previous';
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
        this.activeBreadcrumb = document.querySelector('.active-bc');
        let activeBreadcrumbIndex = this.getElementIndex(this.activeBreadcrumb.parentNode, this.activeBreadcrumb);
        let breadcrumbIndex = this.getElementIndex(event.target.parentNode, event.target);

        if(breadcrumbIndex == activeBreadcrumbIndex) return;

        this.direction = activeBreadcrumbIndex < breadcrumbIndex ? 'next' : 'previous';
        let newActive = this.images.children[breadcrumbIndex];
        this.transition(newActive, this.direction);
    }

    transition(newActive, direction) {
        if(document.querySelectorAll('.transition').length > 0) return;

        if(direction == 'next') {

            this.active.classList.add('hide-left');
        
        } else {

            newActive.classList.add('hide-left');
            getComputedStyle(newActive).getPropertyValue('left'); //force browser to reflow
            
        }

        newActive.classList.add('transition');
        this.active.classList.add('transition');

        this.active.classList.remove('active');
        newActive.classList.add('active');

        this.activeBreadcrumb.classList.remove('active-bc');
        this.activeBreadcrumb.parentNode.children[this.getElementIndex(this.images, newActive)].classList.add('active-bc');

        let self = this;
        this.images.ontransitionend = function(event) {
            event.target.classList.remove('transition', 'hide-left');

            self.resetTimeout();
        }
    }

    resetTimeout() {
        this.init();
    }
    
    init() {
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(this.autoPlay.bind(this), this.timeoutInterval);
        this.active = document.querySelector('.active');
        this.activeBreadcrumb = document.querySelector('.active-bc');
    }

    getElementIndex(parentNode, element) {
        return Array.prototype.indexOf.call(parentNode.children, element);
    }
}

export default Slider;
// let slider = new Slider;
// slider.init();