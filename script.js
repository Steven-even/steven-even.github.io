document.addEventListener('DOMContentLoaded', () => {
    let sections = document.querySelectorAll('section');

    let showCard = (card, designBlock) => {
        card.style.opacity = '1';
        card.style.maxHeight = '60vh';
        designBlock.style.opacity = '1';
        designBlock.style.maxHeight = '50px';
    };

    let hideCard = (card, designBlock) => {
        card.style.opacity = '0';
        card.style.maxHeight = '0';
        designBlock.style.opacity = '0';
        designBlock.style.maxHeight = '0';
    };

    sections.forEach(section => {
        let card = section.querySelector('.card');
        let designBlock = section.querySelector('.design-block');
        let btn = section.querySelector('.expand-btn');
        let sectionId = section.id;
        let navLink = document.querySelector(`.nav-link[data-target="${sectionId}"]`);
        let isPinned = false;

        section.addEventListener('mouseenter', () => {
            showCard(card, designBlock);
            if (navLink) navLink.classList.add('highlighted');
        });

        section.addEventListener('mouseleave', () => {
            if (!isPinned) {
                hideCard(card, designBlock);
            }
            if (navLink) navLink.classList.remove('highlighted');
        });

        btn.addEventListener('click', event => {
            event.stopPropagation();
            isPinned = !isPinned;
            if (isPinned) {
                showCard(card, designBlock);
                btn.textContent = '-';
            }
            else {
                hideCard(card, designBlock);
                btn.textContent = '+';
            }
        });

        if (navLink) {
            navLink.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                if (!isPinned) {
                    isPinned = true;
                    showCard(card, designBlock);
                    btn.textContent = '-';
                }
                section.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        }
    });
});