import React, { useState } from 'react';
import { Carousel, CarouselCaption, CarouselControl, CarouselIndicators, CarouselItem } from 'reactstrap';

export default (props) => {
    const [activeIndex, setActive] = useState(0)
    const [animating, setAnimating] = useState(false)

    const next = () => {
        if (animating) return
        const nextIndex = activeIndex === props.carousel.length -1 ? 0 : activeIndex + 1
        setActive(nextIndex)
    }
    
    const previous = () => {
        if (animating) return
        const prevIndex = activeIndex === 0 ? props.carousel.length -1 : activeIndex - 1
        setActive(prevIndex)
    }

    const goToIndex = (newIndex) => {
        if (animating) return;
        setActive(newIndex)
    }

    const slides = props.carousel.map((item, index) => {
        return (
            <CarouselItem 
                onExiting={() => setAnimating(true)}
                onExited={() => setAnimating(false)}
                key={index}
            >
                <img src={item.image} alt={`slide-${index}`} />
                <CarouselCaption captionHeader={item.title} />
            </CarouselItem>
        )
    })

    return (
        <Carousel
            activeIndex={activeIndex}
            next={next}
            previous={previous}
        >
            <CarouselIndicators items={props.carousel} activeIndex={activeIndex} onClickHandler={goToIndex} />
            {slides}
            <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
            <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
        </Carousel>
    )
}