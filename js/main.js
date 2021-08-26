var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        var renderer = new THREE.WebGLRenderer({alpha:true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // check when the browser size has changed and adjust the camera accordingly
        window.addEventListener('resize', function () {
            var WIDTH = window.innerWidth;
            var HEIGHT = window.innerHeight;
            renderer.setSize(WIDTH, HEIGHT);
            camera.aspect = WIDTH / HEIGHT;
            camera.updateProjectionMatrix();
        });

        camera.position.z = 3;
        camera.position.y = 1.5;

        var ambientLight = new THREE.AmbientLight( 0xffffff, 1.0 );
        scene.add(ambientLight);
        // scene.background = new THREE.Color(0xC0C0C0);
        const loader = new THREE.GLTFLoader();

        // Load a glTF resource
        var model;
        var xSpeed = 0.15;
        var ySpeed = 0.15;
        
        loader.load(
            // resource URL
            './models/player/scene.gltf',
            // called when the resource is loaded
            function (gltf) {
                model = gltf;
               //  console.log(gltf.scene);
                // gltf.scene.children[0].children[0].children[0].children[0].children[0].children[0].children[0].material.metalness=0;
                 gltf.scene.rotation.y+=3.15;
             
                 gltf.scene.scale.x/=350;
                 gltf.scene.scale.y/=350;
                 gltf.scene.scale.z/=350;
                gltf.scene.position.y=0;
                gltf.scene.position.z=0;
                gltf.scene.position.x=0;

                scene.add(gltf.scene);
                gltf.animations; // Array<THREE.AnimationClip>
                gltf.scene; // THREE.Group
                gltf.scenes; // Array<THREE.Group>
                gltf.cameras; // Array<THREE.Camera>
                gltf.asset; // Object

            },
            function (xhr) {

                console.log((xhr.loaded / xhr.total * 100) + '% loaded');

            },
            // called when loading has errors
            function (error) {

                console.log('An error happened');

            }
        );
        // game logic
        const geometry = new THREE.CylinderGeometry( 0.04, 0.04, 0.1, 8 );
        const material = new THREE.MeshBasicMaterial( {color: 0xDC143C} );
        const geometryc = new THREE.CircleGeometry( 0.12, 16 );
        const materialc = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
        const geometryt = new THREE.TorusKnotGeometry( 0.01, 0.04, 64, 8 );
        const materialt = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        // const torusKnot = new THREE.Mesh( geometryt, materialt );
        // scene.add( torusKnot );
        // const circle = new THREE.Mesh( geometry, material );
        // scene.add( circle );
        var cylinder=[];
        var vcylinder=[];
        var l=0,r=0;
        var circle=[];
        var vcircle=[];
        
        var cl=0,cr=0;
        var torus=[];
        var vtorus=[];

        var tl=0,tr=0;

        var st=new Date();
        var stc=new Date();
        var stt=new Date();
        var pot=new Date();

        function randomNumber(min, max) { 
            return Math.random() * (max - min) + min;
        } 
        var cnts=0;
        var cnth=25;

        var update = function () {
            var et=new Date();
            document.getElementById("health").value = cnth;
            document.getElementById("score").value =cnts;
            if(((et-pot)/1000)>0.07){
                pot=new Date();
                for( i=0;i<tr;i++){
                    if(torus[i].scene.position.x<model.scene.position.x )
                    torus[i].scene.position.x+=0.1;   
                    else
                    torus[i].scene.position.x-=0.1;
                    const playerBox = new THREE.Box3().setFromObject(model.scene);
                    const enemyBox = new THREE.Box3().setFromObject(torus[i].scene);
                    if(playerBox.intersectsBox(enemyBox) && vtorus[i]==0) {
                            cnth-=1;
                            scene.remove(torus[i].scene);
                            vtorus[i]=1;

                    }


                }

            }

            if(((et-st)/1000)>0.07){
                st=new Date();
                for( i=0;i<r;i++){
                    cylinder[i].position.z-=0.1;   
                    if(vcylinder[i]==0){
                        const playerBox = new THREE.Box3().setFromObject(cylinder[i]);
                        for( j=0;j<tr;j++){
                            const enemyBox = new THREE.Box3().setFromObject(torus[j].scene);
                            if(playerBox.intersectsBox(enemyBox) && vtorus[j]==0) {
                                    // console.log("YES\n");
                                    scene.remove(cylinder[i]);
                                    scene.remove(torus[j].scene);
                                    vtorus[j]=1;
                                    vcylinder[i]=1

                            }

                        }
                        
                    }   
                }
                for( i=0;i<cr;i++){
                    circle[i].position.z+=0.2;   
                    if(circle[i].position.y>model.scene.position.y)
                        circle[i].position.y-=0.1;   

                    const playerBox = new THREE.Box3().setFromObject(model.scene);
                    const enemyBox = new THREE.Box3().setFromObject(circle[i]);
                    if(playerBox.intersectsBox(enemyBox) && vcircle[i]==0) {
                            cnts+=1;
                            scene.remove(circle[i]);
                            vcircle[i]=1;

                    }
                }
                for( i=0;i<tr;i++){
                    torus[i].scene.position.z+=0.2;   
                    if(torus[i].scene.position.y>model.scene.position.y)
                        torus[i].scene.position.y-=0.1;   
                    const playerBox = new THREE.Box3().setFromObject(model.scene);
                    const enemyBox = new THREE.Box3().setFromObject(torus[i].scene);
                    if(playerBox.intersectsBox(enemyBox) && vtorus[i]==0) {
                            cnth-=1;
                            scene.remove(torus[i].scene);
                            vtorus[i]=1;

                    }

                }

            }
            if(((et-stc)/1000)>5){
                stc=new Date();
                circle[cr] = new THREE.Mesh( geometryc, materialc );
                circle[cr].position.x=randomNumber(-9.0,9.0);
                circle[cr].position.y=model.scene.position.y;
                circle[cr].position.z=-15;
                scene.add( circle[cr] );
                vcircle[cr]=0;
                cr++;


            }
            if(((et-stt)/1000)>7){
                stt=new Date();
                loader.load(
                    './models/enemy/scene.gltf',
                    function (gltf) {
                        torus[tr] = gltf;
                        vtorus[tr]=0;
                        tr++;
                        gltf.scene.scale.x/=80;
                        gltf.scene.scale.y/=80;
                        gltf.scene.scale.z/=80;
                        gltf.scene.position.y=model.scene.position.y;
                        gltf.scene.position.z=-15;
                        gltf.scene.position.x=randomNumber(-12.0,12.0);

                        scene.add(gltf.scene);
                        gltf.animations; // Array<THREE.AnimationClip>
                        gltf.scene; // THREE.Group
                        gltf.scenes; // Array<THREE.Group>
                        gltf.cameras; // Array<THREE.Camera>
                        gltf.asset; // Object

                    },
                    function (xhr) {

                        console.log((xhr.loaded / xhr.total * 100) + '% loaded');

                    },
                    function (error) {

                        console.log('An error happened');

                    }
                );

            }

        };

        // draw scene
        var render = function () {
            renderer.render(scene, camera);
        };

        // run game loop (update, render, repeat)
        var GameLoop = function () {
            requestAnimationFrame(GameLoop);
            update();
            render();
        };
        document.addEventListener("keydown", onDocumentKeyDown, false);
        function onDocumentKeyDown(event) {
            var keyCode = event.which;
            if (keyCode == 87) {
                model.scene.position.z -= ySpeed;
            } else if (keyCode == 83) {
                model.scene.position.z += ySpeed;
            } else if (keyCode == 65) {
                model.scene.position.x -= xSpeed;
            } else if (keyCode == 68) {
                model.scene.position.x += xSpeed;
            } else if (keyCode == 82) {
                model.scene.position.set(0, 0, 0);
            }else if(keyCode==32){
                cylinder[r] = new THREE.Mesh( geometry, material );
                cylinder[r].position.x=model.scene.position.x;
                cylinder[r].position.y=model.scene.position.y;
                cylinder[r].position.z=model.scene.position.z-1;
                cylinder[r].rotation.x+=1.7
                scene.add( cylinder[r] );
                vcylinder[r]=0;
                r++;
            }
            render();
        };
        


        GameLoop();