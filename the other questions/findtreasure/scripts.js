(async () => {
  async function loadLevels() {
    return fetch("./levels.json")
      .then(response => response.json())
      .catch(console.error);
  }

  class LevelHandler {
    constructor(levelCount) {
      this.levelCount = levelCount;
      this.el = document.getElementById('level');
      this.level = 0;
      this.renderLevel();
    }

    getLevel = () => this.level;

    setLevel = (n) => {
      this.level = n;
      this.renderLevel();
    };

    renderLevel = () => {
      if (this.level < this.levelCount) {
        this.el.innerHTML = `Level ${this.level}`;
      } else {
        this.el.innerHTML = "You won!";
      }
    }
  }

  function getDist(mX, sX, mY, sY) {
    return Math.abs((mX - sX) + (mY - sY));
  }

  function calcColor(dist) {
    const color = 255 - Math.floor(dist / 2);
    return color >= 255 ? 255 : color;
  }

  // let's play!
  const nodeSquare = document.getElementById("square");
  const levels = (await loadLevels()).levels;
  const levelHandler = new LevelHandler(levels.length);

  nodeSquare.addEventListener('mousemove', (mouseEvent) => {
    if (levelHandler.getLevel() < levels.length) {
      requestAnimationFrame(() => {
        const [sX, sY] = levels[levelHandler.getLevel()];
        const { layerX: mX, layerY: mY } = mouseEvent;
        const dist = getDist(mX, sX, mY, sY);
        const color = calcColor(dist);

        nodeSquare.style.background = `rgb(${color}, ${color}, ${color})`;

        if (dist < 10) {
          levelHandler.setLevel(levelHandler.getLevel() + 1);
        }

        if (levelHandler.getLevel() >= levels.length) {
          nodeSquare.style.background = "#fff";
        }
      });
    }
  });

  nodeSquare.addEventListener('mouseleave', () => {
    if (levelHandler.getLevel() < levels.length) {
      nodeSquare.style.backgroundColor = "#000";
    }
  });
})();
