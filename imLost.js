let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
	type = "canvas"
}
    
PIXI.loader
	.add("https://i.imgur.com/f2gr3mS.png")
	.load(setup)
    
function setup() {
	var sprites = {head:null, straight:null, corner:null, tail:null, apple:null, melon:null, floor1:null, floor2:null, topwall1:null, topwall2:null, bottomwall1:null, bottomwall2:null, sidewall1:null, sidewall2:null, hole:null}
	var keys = {w:null, a:null, s:null, d:null, space:null}
	sprites = autoSheetLoad("https://i.imgur.com/f2gr3mS.png", 4, 32, 32, sprites);
	var map = createMap(16, 16, 32);
	var rules = [];
	var hazards = [];
	var rule1 = {
			effect: function(x, y, entity, size){
				temptext = sprites.floor1.texture;
				if ((Math.random()*100) <= 20){
					temptext = sprites.floor2.texture;
				}
				entity = createEntity((new PIXI.Sprite(temptext)), []);
				entity.sprite.anchor.set(0.5);
				entity.sprite.x = x * size + (size/2);
				entity.sprite.y = y * size + (size/2);
				return entity;
			}
	}
	rules.push(rule1);
	var rule2 = {
			effect: function(x, y, entity, size){
				if (y < 1){
					var temptext = sprites.topwall1.texture;
					if ((Math.random()*100) <= 20){
						temptext = sprites.topwall2.texture;
					}
					entity = createEntity((new PIXI.Sprite(temptext)), ["solid"]);
					entity.sprite.anchor.set(0.5);
					entity.sprite.x = x * size + (size/2);
					entity.sprite.y = y * size + (size/2);
				}
				return entity;
			}
	}
	rules.push(rule2);
	var rule3 = {
			effect: function(x, y, entity, size){
				if ((x < 1) || (x > 14)){
					var temptext = sprites.sidewall1.texture;
					if ((Math.random()*100) <= 20){
						temptext = sprites.sidewall2.texture;
					}
					entity = createEntity((new PIXI.Sprite(temptext)), ["solid"]);
					entity.sprite.anchor.set(0.5);
					entity.sprite.x = x * size + (size/2);
					entity.sprite.y = y * size + (size/2);
				}
				return entity;
			}
	}
	rules.push(rule3);
	var rule4 = {
			effect: function(x, y, entity, size){
				if (y > 14){
					var temptext = sprites.bottomwall1.texture;
					if ((Math.random()*100) <= 20){
						temptext = sprites.bottomwall2.texture;
					}
					entity = createEntity((new PIXI.Sprite(temptext)), ["solid"]);
					entity.sprite.anchor.set(0.5);
					entity.sprite.x = x * size + (size/2);
					entity.sprite.y = y * size + (size/2);
				}
				return entity;
			}
	}
	rules.push(rule4);
	var rule5 = {
			effect: function(x, y, entity, size){
				if ((x > 0) && (x < 15) && (y > 1) && (y < 14) && (Math.random()*100) <= 20){
					var temptext = sprites.bottomwall1.texture;
					entity = createEntity((new PIXI.Sprite(temptext)), ["solid"]);
					entity.sprite.anchor.set(0.5);
					entity.sprite.x = x * size + (size/2);
					entity.sprite.y = y * size + (size/2);
				}
				return entity;
			}
	}
	rules.push(rule5);
	var rule6 = {
			effect: function(x, y, entity, size){
				if ((x == 8) && ((y < 1) || (y > 14))){
					var temptext = sprites.corner.texture;
					var flags = Array();
					if (y > 14){
						flags.push("solid");
					} else if (y < 1){
						flags.push("exit");
					}
					entity = createEntity((new PIXI.Sprite(temptext)), flags);
					entity.sprite.anchor.set(0.5);
					entity.sprite.x = x * size + (size/2);
					entity.sprite.y = y * size + (size/2);
				}
				return entity;
			}
	}
	rules.push(rule6);
	var rule7 = {
			effect: function(x, y, entity, size){
				if ((x > 0) && (x < 15) && (y > 1) && (y < 14) && (Math.random()*100) <= 4){
					var temptext = sprites.hole.texture;
					entity = createEntity((new PIXI.Sprite(temptext)), ["pit"]);
					entity.sprite.anchor.set(0.5);
					entity.sprite.x = x * size + (size/2);
					entity.sprite.y = y * size + (size/2);
				}
				return entity;
			}
	}
	rules.push(rule7);
	var rule8 = {
			effect: function(x, y, entity, size){
				if ((x > 0) && (x < 15) && (y > 1) && (y < 14) && (Math.random()*100) <= 2){
					var temptext = sprites.apple.texture;
					entity = createEntity((new PIXI.Sprite(temptext)), ["food"]);
					entity.sprite.anchor.set(0.5);
					entity.sprite.x = x * size + (size/2);
					entity.sprite.y = y * size + (size/2);
				}
				return entity;
			}
	}
	hazards.push(rule8);
	var rule9 = {
			effect: function(x, y, entity, size){
				if ((x > 0) && (x < 15) && (y > 1) && (y < 14) && (Math.random()*100) <= 2){
					var temptext = sprites.straight.texture;
					entity = createEntity((new PIXI.Sprite(temptext)), ["solid", "enemy"]);
					entity.sprite.anchor.set(0.5);
					entity.sprite.x = x * size + (size/2);
					entity.sprite.y = y * size + (size/2);
				}
				return entity;
			}
	}
	hazards.push(rule9);
	map.buildRoom(rules);
	map.buildRoom(hazards);
	var testsprite = new PIXI.Sprite(sprites.head.texture);
	var testentity = createEntity(testsprite, ["solid"]);
	var player1 = createPlayer(keys, testentity, map, {x: 8, y: 14, z: 0});
	var enemies = populate(player1, map);
	map.render();
	app.ticker.add(delta => gameLoop(delta, player1, enemies, map, rules, hazards, sprites));
	}

function gameLoop(delta, player1, enemies, map, rules, hazards, sprites){
	var roomcounter;
	
	if(player1.counter >= 30){
		player1.checkInput();
		if (player1.keys.w) {
			player1.entity.sprite.rotation = 0
			player1.moveEntity(player1.pos.x, player1.pos.y - 1);
		} else if (player1.keys.a) {
			player1.entity.sprite.rotation = 4.71
			player1.moveEntity(player1.pos.x - 1, player1.pos.y);
		} else if (player1.keys.s) {
			player1.entity.sprite.rotation = 3.14
			player1.moveEntity(player1.pos.x, player1.pos.y + 1);
		} else if (player1.keys.d) {
			player1.entity.sprite.rotation = 1.57
			player1.moveEntity(player1.pos.x + 1, player1.pos.y);
		}
		for (var i = 0; i < (map.map[player1.pos.x][player1.pos.y].length); i++){
				if (map.map[player1.pos.x][player1.pos.y][i].flags.includes("exit")){
					roomcounter += 1;
					map.wipe();
					map.buildRoom(rules);
					map.buildRoom(hazards);
					//enemies = populate(player1, map);
					player1.moveEntity(8, 14);
					break;
				}
				if (map.map[player1.pos.x][player1.pos.y][i].flags.includes("food")){
					map.map[player1.pos.x][player1.pos.y].splice(i, 1);
					player1.score += 100
				}
				if (map.map[player1.pos.x][player1.pos.y][i].flags.includes("pit")){
					player1.kill();
				}
			}
		player1.counter = 0;
		}
	for (var i = 0; i < (enemies.length); i++){
		if(enemies[i].counter >= 50){
			moveEntity(enemies[i]);
		}
	}
	player1.counter += 1;
	map.render();
	}

function textureFromSheet(file, x, y, height, width){
	//will create a unique texture to be used with sprites from texture data
	var image = PIXI.BaseTexture.fromImage(file);
	let frame = new PIXI.Rectangle(x, y, width, height);
	var texture = new PIXI.Texture(image, frame);
	return texture;
}

function autoSheetLoad(file, sheetXcount, spriteX, spriteY, sprites){
	var x = 0; // 
	var y = 0;
			
	for (var i = 0; i < (Object.keys(sprites).length); i++){
		var texture = textureFromSheet(file, x, y, spriteX, spriteY);
		let sprite = new PIXI.Sprite(texture);
		sprites[Object.keys(sprites)[i]] = sprite;
		sprite.x = x + 1;
		sprite.y = y + 1;
			if (x >= ((sheetXcount - 1) * spriteX)){
				x = 0;
				y += spriteY;
			} else {
				x += spriteX;
			}
	}
	return sprites;
}

function randomfromList(list){
	var choice = Math.random() * (list.length-1);
	return list[Math.round(choice)]
}

function createEntity(sprite, flags){
	var entity = {
			  sprite: sprite,
			  flags : flags
			}
	return entity;
}

function createPlayer(keys, entity, map, pos){
	entity.sprite.anchor.set(0.5); 
	var player = {
		keys: keys,
		entity: entity,
		counter: 0,
		score: 0,
		pos: pos,
		map: map,
		checkInput: function(){
			var input = new Pinput();
			input.update();
			for (var i = 0; i < Object.keys(keys).length; i++){
				if (input.isDown(Object.keys(keys)[i])){
					var temp = Object.keys(keys)[i];
					keys[Object.keys(keys)[i]] = true; //confusing i know but we are inserting into the field of the key that we got from a list we made from the keys of the obejct, i did it like this because it's easier to write keys like this, compared to say rules, and i hate myself 
				} else {
					keys[Object.keys(keys)[i]] = false;
				}
			}
		},
		moveEntity: function(x, y){
			for (var i = 0; i < map.map[x][y].length; i++){
				if (map.map[x][y][i].flags.includes("solid")){
					x = pos.x;
					y = pos.y;
				}
			}
			map.map[pos.x][pos.y].splice(pos.z, 1);
			map.map[x][y].push(entity);
			entity.sprite.x = map.size * x + (map.size/2);
			entity.sprite.y = map.size * y + (map.size/2);
			pos.x = x;
			pos.y = y;
			pos.z = map.map[x][y].indexOf(entity);
		},
		kill: function(){
			map.wipe();
			player.keys = {};
			let gameover = new PIXI.Text("Game over! \n final score was:\n" + player.score, new PIXI.TextStyle({fontFamily: "Arial", fontSize: 36, fill: '#c3c3c3', stroke: "black", strokeThickness: 4,}));
			gameover.position.set(150, 200);
			app.stage.addChild(gameover);
		}
	}
	map.map[pos.x][pos.y].push(entity);
	entity.sprite.x = map.size * pos.x + (map.size/2);
	entity.sprite.y = map.size * pos.y + (map.size/2);
	return player;
}

function createNPC(target, entity, map, pos){
	entity.sprite.anchor.set(0.5); 
	var NPC = {
	target: target,
	entity: entity,
	counter: 0,
	pos: pos,
	map: map,
	moveEntity: function(x, y){
		var x = pos.x;
		var y = pos.y;

		if (target.pos.x > pos.x){
			x += 1;
		} else if (target.pos.x < pos.x){
			x -= 1;
		}
		if (target.pos.y > pos.y){
			y += 1;
		} else if (target.pos.y < pos.y){
			y -= 1;
		}
		map.map[pos.x][pos.y].splice(pos.z, 1);
		map.map[x][y].push(entity);
		entity.sprite.x = map.size * x + (map.size/2);
		entity.sprite.y = map.size * y + (map.size/2);
		pos.x = x;
		pos.y = y;
		pos.z = map.map[x][y].indexOf(entity);
		}
	}
	map.map[pos.x][pos.y].push(entity);
	entity.sprite.x = map.size * pos.x + (map.size/2);
	entity.sprite.y = map.size * pos.y + (map.size/2);
	return NPC;
}

function createMap(x, y, size){
	var map = new Array(x);
	
	for (var a = 0; a < map.length; a++){
		map[a] = new Array(y);
		for (var b = 0; b < map[a].length; b++){
			map[a][b] = new Array();
		}
	} 
	
	var mapobject = {
			  map: map,
			  size: size, //32 in Vsnake
			  buildRoom : function(rules) {
				  for (var a = 0; a < map.length; a++){
					  for (var b = 0; b < map[a].length; b++){
						  var entity = null;
						  for (var c = 0; c < rules.length; c++){
							  entity = rules[c].effect(a, b, entity, size);
							  }
						  if (entity != null){
							  map[a][b].push(entity);
						  }
						}
				  }
			  },
			  render : function(){
				  for (var a = 0; a < map.length; a++){
					  for (var b = 0; b < map[a].length; b++){
						  for (var c = 0; c < map[a][b].length; c++){
							  if (map[a][b][c] !=  null){
								  app.stage.addChild(map[a][b][c].sprite);
							  }
						  }
					  }
				  } 
			  },
			  wipe : function(){
				  for (var a = 0; a < map.length; a++){
					  for (var b = 0; b < map[a].length; b++){
						  map[a][b] = [];
					  } 
				 }	
			 }	
	}
	return mapobject;
}

function populate(target, map) {
	var enemies = [];
	for (var a = 0; a < map.map.length; a++){
		  for (var b = 0; b < map.map[a].length; b++){
			  for (var c = 0; c < map.map[a][b].length; c++){
				  if (map.map[a][b][c].flags.includes("enemy")){
					  //enemies.push(createNPC(target, map.map[a][b][c], map, {x:a, y:b, z:c}));
				  }
			  }
		  }
	  }
	return enemies;
} 
    
let app = new PIXI.Application({width: 512, height: 512});
document.body.appendChild(app.view);

//PIXI.utils.sayHello(type);