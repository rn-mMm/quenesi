(function() {
    const CONFIG = {
        catsCount: 5,
        minDistance: 0.25,
        borderMargin: 0.05,
        catImageSrc: 'картинки/geibyec.svg',
        desktopSize: 30,
        mobileSize: 45
    };

    let score = 0;
    const catsArray = [];

    const button = document.getElementById('сас');
    const startWindow = document.querySelector('.start');
    const imgNode = document.getElementById('image');
    const containerNode = document.getElementById('sxs');
    const counter = document.getElementById('scoreCounter');

    if (!button || !imgNode || !containerNode || !counter) return;

    button.addEventListener('click', () => {
        startWindow.remove();
        if (typeof initZoom === 'function') initZoom();
        startGame();
    });

    if (typeof pz !== 'undefined' && pz.on) {
        pz.on('transform', updateAllCatsPositions);
        pz.on('zoom', updateAllCatsPositions);
    } else {
        window.addEventListener('resize', updateAllCatsPositions);
    }

    function startGame() {
        const oldCat = document.getElementById('cat');
        if (oldCat) oldCat.remove();

        for (let i = 0; i < CONFIG.catsCount; i++) {
            const catImg = document.createElement('img');
            catImg.src = CONFIG.catImageSrc;
            catImg.className = 'cat';
            catImg.style.position = 'absolute';
            catImg.style.display = 'block';
            catImg.style.zIndex = '4';
            catImg.style.cursor = 'pointer';
            catImg.style.userSelect = 'none';
            catImg.style.webkitUserDrag = 'none';
            catImg.style.mixBlendMode = 'difference';

            const size = window.innerWidth <= 768 ? CONFIG.mobileSize : CONFIG.desktopSize;
            catImg.style.width = `${size}px`;
            catImg.style.height = `${size}px`;

            containerNode.appendChild(catImg);

            const catData = {
                element: catImg,
                currentX: 0.5,
                currentY: 0.5
            };

            catImg.addEventListener('pointerdown', (e) => {
                e.stopPropagation();
                score++;
                counter.textContent = `Количество котов: ${score}`;
                teleportCat(catData);
            });

            teleportCat(catData, true);
            catsArray.push(catData);
        }
    }

    function teleportCat(catData, isFirst = false) {
        let valid = false;
        let attempts = 0;
        let targetPercentX = 0.5;
        let targetPercentY = 0.5;

        while (!valid && attempts < 100) {
            targetPercentX = CONFIG.borderMargin + Math.random() * (1 - CONFIG.borderMargin * 2);
            targetPercentY = CONFIG.borderMargin + Math.random() * (1 - CONFIG.borderMargin * 2);

            if (isFirst) {
                valid = true;
            } else {
                const dx = targetPercentX - catData.currentX;
                const dy = targetPercentY - catData.currentY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist >= CONFIG.minDistance) {
                    valid = true;
                }
            }
            attempts++;
        }

        catData.currentX = targetPercentX;
        catData.currentY = targetPercentY;
        updateSingleCatPosition(catData);
    }

    function updateSingleCatPosition(catData) {
        let transform = { scale: 1, x: 0, y: 0 };
        if (typeof pz !== 'undefined' && pz.getTransform) {
            transform = pz.getTransform();
        }

        const container = containerNode.getBoundingClientRect();
        const imgNaturalWidth = imgNode.naturalWidth || container.width;
        const imgNaturalHeight = imgNode.naturalHeight || container.height;

        const containerRatio = container.width / container.height;
        const imgRatio = imgNaturalWidth / imgNaturalHeight;

        let displayWidth = container.width;
        let displayHeight = container.height;
        let offsetX = 0;
        let offsetY = 0;

        if (imgRatio > containerRatio) {
            displayHeight = container.width / imgRatio;
            offsetY = (container.height - displayHeight) / 2;
        } else {
            displayWidth = container.height * imgRatio;
            offsetX = (container.width - displayWidth) / 2;
        }

        const size = window.innerWidth <= 768 ? CONFIG.mobileSize : CONFIG.desktopSize;
        const imageSpaceX = offsetX + catData.currentX * displayWidth;
        const imageSpaceY = offsetY + catData.currentY * displayHeight;
        const screenX = imageSpaceX * transform.scale + transform.x - (size / 2);
        const screenY = imageSpaceY * transform.scale + transform.y - (size / 2);

        catData.element.style.left = `${screenX}px`;
        catData.element.style.top = `${screenY}px`;
    }

    function updateAllCatsPositions() {
        catsArray.forEach(catData => {
            updateSingleCatPosition(catData);
        });
    }

    window.addEventListener('resize', updateAllCatsPositions);
})();
