import '../style.css'
import {
  Application,
  Sprite,
  Graphics,
  Assets,
  AnimatedSprite,
} from 'pixi.js';
import botSprite from './assets/bot.png';

const app = new Application({width: 960, height: 540})
document.querySelector('#app').appendChild(app.view);

Assets.load("./src/assets/sprite/fire/fire.json").then(sheet => {
  // console.log('sheet', sheet);
  console.log(Assets.cache.get("./src/assets/sprite/fire/fire.json").data.animations);
  let fireAni = AnimatedSprite.fromFrames(sheet.data.animations['fire_01'])
  fireAni.animationSpeed = 0.5;
  fireAni.position.set(200, 300);
  fireAni.play();
  app.stage.addChild(fireAni);
})

let sprite = Sprite.from(botSprite);
sprite.eventMode = "dynamic";
sprite.width = 120;
sprite.height = 120;
sprite.position.set(200, 200);
sprite.anchor.set(0.5);
sprite.on('pointerdown', event => {
  sprite.isRotation = !sprite.isRotation;
  console.log(sprite.scale.x)
})

app.stage.addChild(sprite);

let elapsed = 0.0;

let speed = 2;
app.ticker.add(delta => {
  sprite.isRotation && (sprite.rotation += 0.1 * delta);
  elapsed += delta;
})