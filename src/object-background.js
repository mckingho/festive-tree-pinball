import { frameThickness, potGeometry, seedDimension, faucetGeometry, trunkDimension, leavesGeometry, giftGeometry } from './dimension.js';
import { getConfig } from './stages/settings.js'
import { findXFrom2PointsOnOneLineAndY } from './util.js';

let instance;

class ObjectBackground {
    constructor() {
        if (!instance) {
            this.canvas = document.getElementById('board-background');
            this.ctx = this.canvas.getContext('2d');

            this.isInitDrawn = false; // set true after first draw() function call
            this.potY = 0; // pot y position. set when pot is drawn
            this.seedYOffset = 60; // seed y position offset upwards. used for starting animation
            this.isShowCharacters = [false, false, false, false];

            this.frameImg = new Image();
            this.frameImg.src = 'resources/textures/brown_bamboo.svg';

            this.decorLeaf1Img = new Image();
            this.decorLeaf1Img.src = 'resources/images/leaves/decor_leaf1.svg';
            this.decorLeaf2Img = new Image();
            this.decorLeaf2Img.src = 'resources/images/leaves/decor_leaf2.svg';
            this.decorLeaf3Img = new Image();
            this.decorLeaf3Img.src = 'resources/images/leaves/decor_leaf3.svg';

            this.potImg = new Image();
            this.potImg.src = 'resources/images/pot.png';

            this.seedImg = new Image();
            this.seedImg.src = 'resources/images/pinecone.svg';

            this.faucetImg = new Image();
            this.faucetImg.src = 'resources/images/faucet.png';

            this.trunkImg = new Image();
            this.trunkImg.src = 'resources/images/trunk.png';

            this.shelfImg = new Image();
            this.shelfImg.src = 'resources/images/shelf.svg';

            this.calendarImg = new Image();
            this.calendarImg.src = 'resources/images/calendar.svg';

            this.leavesImgs = [new Image(), new Image(), new Image(), new Image()];
            this.boxImgs = [new Image(), new Image(), new Image(), new Image()];
            this.charImgs = [new Image(), new Image(), new Image(), new Image()];
            this.trunkImg.onload = () => {
                this.leavesImgs[0].src = 'resources/images/leaves/leaves1.svg';
                this.leavesImgs[1].src = 'resources/images/leaves/leaves2.svg';
                this.leavesImgs[2].src = 'resources/images/leaves/leaves3.svg';
                this.leavesImgs[3].src = 'resources/images/leaves/leaves4.svg';

                // map index to id mod 4
                this.boxImgs[0].src = 'resources/images/giftbox4.png';
                this.boxImgs[1].src = 'resources/images/giftbox1.png';
                this.boxImgs[2].src = 'resources/images/giftbox2.png';
                this.boxImgs[3].src = 'resources/images/giftbox3.png';

                this.charImgs[0].src = 'resources/images/characters/snowman.png';
                this.charImgs[1].src = 'resources/images/characters/bear.png';
                this.charImgs[2].src = 'resources/images/characters/gingerbread.png';
                this.charImgs[3].src = 'resources/images/characters/reindeer.png';
            }

            // init which and how leaves render
            this.leavesLoadIndices = Array(4).fill().map(() => Math.floor(Math.random() * 8));

            // for floor drawing
            this.floorPoints = [];

            // for calendar display
            const today = new Date();
            this.date1 = Math.floor(today.getDate() / 10);
            this.date2 = today.getDate() % 10;
            this.month1 = Math.floor((today.getMonth() + 1) / 10);
            this.month2 = (today.getMonth() + 1) % 10;
            this.isCalendarSet = [false, false, false, false];

            instance = this;
        }

        return instance;
    }

    resizeRender(width, height) {
        // Need to set canvas dimension before draw because it may be resized
        this.canvas.width = width;
        this.canvas.height = height;

        this.calculateFloor();
    }

    draw(stage = 0) {
        const w = this.canvas.width;
        const h = this.canvas.height;

        this.ctx.clearRect(0, 0, w, h);

        this.drawWall();

        this.drawFloor();

        this.drawLoadedFrame();

        this.drawLoadedDecorLeaf1();
        this.drawLoadedDecorLeaf2();
        this.drawLoadedDecorLeaf3();

        // get stage render config
        const stageConfig = getConfig(stage);

        this.drawLoadedPot();

        this.drawLoadedSeed(stageConfig);

        if (stageConfig.trunk) {
            this.drawTrunk()
        }

        if (stageConfig.leavesMax > 0) {
            for (let i = 0; i < stageConfig.leavesMax; i += 1) {
                this.drawLeaves(i);
                this.drawBox(i);
                if (this.isShowCharacters[i]) {
                    this.drawCharacter(i);
                }
            }
        }

        this.drawLoadedShelf();

        this.drawLoadedCalendar();

        this.drawLoadedFaucet(stageConfig);

        this.isInitDrawn = true;

        // starting animation
        if (this.seedYOffset > 0) {
            this.seedYOffset = this.seedYOffset - 1;
            window.requestAnimationFrame(() => { this.draw(); });
        }
    }

    drawWall() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        this.ctx.fillStyle = 'rgba(74, 112, 86, 1)';
        this.ctx.fillRect(0, 0, w, h);
    }

    // calculate the line points for drawing floor pattern
    calculateFloor() {
        const w = this.canvas.width;
        const h = this.canvas.height;

        const upIntervals = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
        const upXs = upIntervals.map((x) => x * w);
        const { dy: potDy, height: potHeight } = potGeometry(w, h);
        const floorOffset = potHeight / 5; // offset to higher than pot bottom
        const upY = potDy + potHeight - floorOffset;
        const convergeX = w / 2;
        const convergeY = 0;
        const lowXs = upXs.map((x) => findXFrom2PointsOnOneLineAndY(x, upY, convergeX, convergeY, h));

        this.floorPoints = [];
        for (let i = 0; i < lowXs.length; i += 1) {
            this.floorPoints.push({ x1: upXs[i], y1: upY, x2: lowXs[i], y2: h });
        }
    }

    drawFloor() {
        if (this.floorPoints.length > 0) {
            const w = this.canvas.width;
            const { y1: dy, y2: h } = this.floorPoints[0];
            this.ctx.fillStyle = '#845937';
            this.ctx.fillRect(0, dy, w, h - dy);
            this.ctx.strokeStyle = '#59321D';
            // horizontal line
            this.ctx.beginPath();
            this.ctx.moveTo(0, dy);
            this.ctx.lineTo(w, dy);
            this.ctx.stroke();
            for (const pt of this.floorPoints) {
                const { x1, y1, x2, y2 } = pt;
                // floor pattern
                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                this.ctx.stroke();
            }
        }
    }

    drawLoadedFrame() {
        if (!this.isInitDrawn) {
            this.frameImg.onload = () => {
                this.createFramePattern();
                this.drawFrame();
            }
        }
        this.createFramePattern();
        this.drawFrame();
    }

    createFramePattern() {
        if (this.frameImg.complete && !this.framePattern) {
            const frW = frameThickness(this.canvas.width);
            const segmentH = frW * 3;
            const frameCanvas = document.createElement("CANVAS");
            frameCanvas.width = frW;
            frameCanvas.height = segmentH;
            frameCanvas.getContext('2d').drawImage(this.frameImg, 0, 0, frW, segmentH);
            this.framePattern = this.ctx.createPattern(frameCanvas, 'repeat-y');
        }
    }

    // draw frames on both sides
    drawFrame() {
        if (this.framePattern) {
            const frW = frameThickness(this.canvas.width);
            const frOffsetH = this.canvas.height / 4 - frW;
            const frH = this.canvas.height - frOffsetH;
            this.ctx.fillStyle = this.framePattern;
            // translate ctx so that pattern starts at 0,0 when filling
            this.ctx.translate(0, frOffsetH);
            this.ctx.fillRect(0, 0, frW, frH); // left
            const dx2 = this.canvas.width - frW;
            this.ctx.translate(dx2, 0);
            this.ctx.fillRect(0, 0, frW, frH); // right
            this.ctx.translate(-dx2, -frOffsetH);
        }
    }

    drawLoadedDecorLeaf1() {
        if (!this.isInitDrawn) {
            this.decorLeaf1Img.onload = () => {
                this.drawDecorLeaf1();
            }
        }
        this.drawDecorLeaf1();
    }

    drawDecorLeaf1() {
        const frW = frameThickness(this.canvas.width);
        const dx = frW / 2;
        const dy = this.canvas.height - this.canvas.height / 8;
        const side = frW * 2;
        this.ctx.drawImage(this.decorLeaf1Img, dx, dy, side, side);
    }

    drawLoadedDecorLeaf2() {
        if (!this.isInitDrawn) {
            this.decorLeaf2Img.onload = () => {
                this.drawDecorLeaf2();
            }
        }
        this.drawDecorLeaf2();
    }

    drawDecorLeaf2() {
        const frW = frameThickness(this.canvas.width);
        const dx = frW / 2;
        const dy = this.canvas.height / 4;
        const side = frW * 3;
        this.ctx.drawImage(this.decorLeaf2Img, dx, dy, side, side);
    }

    drawLoadedDecorLeaf3() {
        if (!this.isInitDrawn) {
            this.decorLeaf3Img.onload = () => {
                this.drawDecorLeaf3();
            }
        }
        this.drawDecorLeaf3();
    }

    drawDecorLeaf3() {
        const frW = frameThickness(this.canvas.width);
        const width = frW * 3;
        const height = width / 2;
        const dx = this.canvas.width - frW;
        const dy = this.canvas.height / 2 - this.canvas.height / 8;
        this.ctx.translate(dx, dy);
        this.ctx.rotate(Math.PI / 2);
        this.ctx.drawImage(this.decorLeaf3Img, 0, 0, width, height);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.translate(-dx, -dy);
    }

    drawLoadedPot() {
        if (!this.isInitDrawn) {
            this.potImg.onload = () => {
                this.drawPot();
            }
        }
        this.drawPot();
    }

    drawPot() {
        const { dx, dy, width, height } = potGeometry(this.canvas.width, this.canvas.height);
        // pot shadow
        const shadowYR = 4;
        this.ctx.fillStyle = 'rgba(0, 0, 0, .3)';
        this.ctx.beginPath();
        this.ctx.ellipse(dx + width / 2, dy + height, width / 2, shadowYR, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        // pot
        this.ctx.drawImage(this.potImg, dx, dy, width, height);
        this.potY = dy;
        this.potWidth = width;
    }

    drawLoadedSeed(config) {
        if (!this.isInitDrawn) {
            this.seedImg.onload = () => {
                if (config.seed) {
                    this.drawSeed();
                }
            }
        }
        if (config.seed) {
            this.drawSeed();
        }
    }

    drawSeed() {
        const w = this.canvas.width;
        const { width, height } = seedDimension(this.canvas.width, this.canvas.height);
        const dx = w / 2 - width / 2;
        const dy = this.potY - height - this.seedYOffset;
        this.ctx.drawImage(this.seedImg, dx, dy, width, height);
    }

    drawLoadedFaucet(config) {
        if (!this.isInitDrawn) {
            this.faucetImg.onload = () => {
                if (config.faucet) {
                    this.drawFaucet();
                }
            }
        }
        if (config.faucet) {
            this.drawFaucet();
        }
    }

    drawFaucet() {
        const { dx, dy, width, height } = faucetGeometry(this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.faucetImg, dx, dy, width, height);
    }

    drawTrunk() {
        const { width, height } = trunkDimension(this.potWidth);
        const dx = this.canvas.width / 2 - width / 2;
        const dy = this.potY - height;
        this.ctx.drawImage(this.trunkImg, dx, dy, width, height);
    }

    drawLeaves(leavesLevel) {
        const { dx, dy, width, height } = leavesGeometry(this.canvas.width, this.canvas.height, leavesLevel);
        const loadIdx = this.leavesLoadIndices[leavesLevel];
        const imgIdx = Math.floor(loadIdx / 2);
        if (loadIdx % 2) {
            this.ctx.drawImage(this.leavesImgs[imgIdx], dx, dy, width, height);
        } else {
            // flip image
            this.ctx.save();
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(this.leavesImgs[imgIdx], -dx, dy, -width, height);
            this.ctx.restore();
        }
    }

    drawBox(id) {
        const { dx, dy, width, height } = giftGeometry(this.canvas.width, this.canvas.height, id);
        this.ctx.drawImage(this.boxImgs[id], dx, dy, width, height);
    }

    drawLoadedShelf() {
        if (!this.isInitDrawn) {
            this.shelfImg.onload = () => {
                for (let i = 0; i < 4; i += 1) {
                    this.drawShelf(i);
                }
            }
        }
        for (let i = 0; i < 4; i += 1) {
            this.drawShelf(i);
        }
    }

    // draw shelf for gift box
    // params: gift box id
    drawShelf(id) {
        const { shelfDx: dx, shelfDy: dy, shelfWidth: width, shelfHeight: height } = giftGeometry(this.canvas.width, this.canvas.height, id);
        this.ctx.drawImage(this.shelfImg, dx, dy, width, height);
    }

    // set isShow flag of characters
    setShowCharacter(isShows) {
        if (isShows.length == 4) {
            this.isShowCharacters = isShows;
        }
    }

    // draw characters above gift box
    // params: gift box id
    drawCharacter(id) {
        const { dx, dy, width } = giftGeometry(this.canvas.width, this.canvas.height, id);
        const w2h = this.charImgs[id].width / this.charImgs[id].height;
        const drawHeight = width / w2h;
        this.ctx.drawImage(this.charImgs[id], dx, dy - drawHeight, width, drawHeight);
    }

    drawLoadedCalendar() {
        if (!this.isInitDrawn) {
            this.calendarImg.onload = () => {
                this.drawCalendar();
            }
        }
        this.drawCalendar();
    }

    // set calendar digits to festival date (12-25)
    // param: [bool, bool, bool, bool] 
    // indicates whether 4 digits on calendar, mmdd will be set to festival date or not
    setCalendar(isCalendarSet) {
        if (isCalendarSet.length == 4) {
            this.isCalendarSet = isCalendarSet;
            if (isCalendarSet[0]) {
                this.month1 = 1;
            }
            if (isCalendarSet[1]) {
                this.month2 = 2;
            }
            if (isCalendarSet[2]) {
                this.date1 = 2;
            }
            if (isCalendarSet[3]) {
                this.date2 = 5;
            }
        }
    }

    drawCalendar() {
        // below right bottom shelf
        const shelfId = 1;
        const {
            shelfDx: dx,
            shelfDy,
            shelfWidth: width,
            shelfHeight,
        } = giftGeometry(this.canvas.width, this.canvas.height, shelfId);

        const margin = 4;
        const dy = shelfDy + shelfHeight + margin;
        this.ctx.drawImage(this.calendarImg, dx, dy, width, width);

        // draw month and date digit
        // use dimension based on the calendar image resource
        const imgW = 240;
        const monthHeight = 80;
        // assume cap height * 1.5 = height,
        // and shift downwards half of descendant,
        // so shift height = 1.25 * cap height
        // i.e. shift height = 1.25 * height / 1.5
        const monthShiftHeight = monthHeight * 1.25 / 1.5;
        const ringHeight = 20;
        const monthHeightOffset = width * (ringHeight + monthShiftHeight) / imgW;
        const monthFont = width * monthHeight / imgW;
        this.ctx.font = monthFont + 'px Helvetica';
        const month1Metric = this.ctx.measureText(this.month1);
        const monthPadding = 2;
        this.ctx.fillStyle = '#F0E7DA';
        this.ctx.fillText(this.month1, dx + width / 2 - month1Metric.width - monthPadding, dy + monthHeightOffset);
        this.ctx.fillText(this.month2, dx + width / 2 + monthPadding, dy + monthHeightOffset);

        // isCalendarSet hint mm
        const r = 6.5;
        const hintR = width * r / imgW;
        let hintHeightOffset = width * (ringHeight + r * 2) / imgW;
        if (this.isCalendarSet[0]) {
            this.ctx.beginPath();
            this.ctx.arc(dx + hintR * 2, dy + hintHeightOffset, hintR, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        if (this.isCalendarSet[1]) {
            this.ctx.beginPath();
            this.ctx.arc(dx + width - hintR * 2, dy + hintHeightOffset, hintR, 0, 2 * Math.PI);
            this.ctx.fill();
        }

        const dateHeight = 140;
        const dateShiftHeight = dateHeight * 1.25 / 1.5;
        const dateHeightOffset = width * (ringHeight + monthHeight + dateShiftHeight) / imgW;
        const dateFont = width * dateHeight / imgW;
        this.ctx.font = dateFont + 'px Helvetica';
        const date1Metric = this.ctx.measureText(this.date1);
        const datePadding = 2;
        this.ctx.fillStyle = '#6D1919';
        this.ctx.fillText(this.date1, dx + width / 2 - date1Metric.width - datePadding, dy + dateHeightOffset);
        this.ctx.fillText(this.date2, dx + width / 2 + datePadding, dy + dateHeightOffset);

        // isCalendarSet hint dd
        hintHeightOffset = width * (ringHeight + monthHeight + r * 2) / imgW;
        if (this.isCalendarSet[2]) {
            this.ctx.beginPath();
            this.ctx.arc(dx + hintR * 2, dy + hintHeightOffset, hintR, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        if (this.isCalendarSet[3]) {
            this.ctx.beginPath();
            this.ctx.arc(dx + width - hintR * 2, dy + hintHeightOffset, hintR, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }

    // cleanup
    clear() {
        instance = null;
    }
}

export default ObjectBackground;
