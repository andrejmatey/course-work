define(function (){
    var table = {
        length: dr.models.table.length,
        width: dr.models.table.width,
        height: dr.models.table.height,
        gamePlaneHeight: dr.models.table.baseHeight/2 + dr.models.table.baizeHeight + 0.045,

        baseHeight: dr.models.table.baseHeight,

        baizeHeight: dr.models.table.baizeHeight,
        baizeFriction: 0.95,
        baizeRestitution: 0.1,


        sideHoleLength: 3.5 * dr.models.ball.radius,
        sideWidth: 3,
        sideHeight: dr.models.ball.radius + 0.5,
        sideFriction: 0.8,
        sideRestitution: 0.8,

        mesh: null,
        materials: null,

        get: function() {
            return this.mesh;
        },

        create: function() {
            this.mesh = this._createTableBase();
            this._createTableBaize();
            this._createTableSides();

            return this.mesh;
        },

        _createTableBase: function() {
            var geometry, material, texture, mesh, shape, path, tableBase, tableBaseBSP, i,
                cylinderHole, cylinderHoleBSP, holes;

            texture = dr.textures.brownDarkWood;
            material = new THREE.MeshLambertMaterial({
                color: dr.colors.brown,
                map: texture
            });
            geometry = new THREE.CubeGeometry(this.length, this.width, this.baseHeight);

            mesh = new Physijs.BoxMesh(
                geometry,
                Physijs.createMaterial(
                    material, 0.99,0
                ),
                0
            );
            mesh.rotation.x += Math.PI/2;
            mesh.castShadow = true;
            return mesh;
        },

        _createTableBaize: function() {
            var geometry, material, texture, mesh;
            geometry = new THREE.CubeGeometry(this.length, this.width, this.baizeHeight);

            texture = dr.textures.greenLightBaize;
            material = new THREE.MeshLambertMaterial({
                color: dr.colors.green,
                map: texture
            });

            mesh = new Physijs.BoxMesh(
                geometry,
                Physijs.createMaterial(
                    material,
                    this.baizeFriction,
                    this.baizeRestitution
                ), 0
            );
            mesh.rotation.x += Math.PI/2;
            mesh.position.y = this.gamePlaneHeight - this.baizeHeight/2;
            mesh.receiveShadow = true;

            dr.scene.add(mesh);
        },

        _createTableSides: function() {
            var geometry, material, color, texture, sideMesh, sideLength, sideParts, createSideElement;

            texture = dr.textures.greenLightBaize;
            color = dr.colors.green;
            material = new THREE.MeshLambertMaterial({
                color: color,
                map: texture
            });

            sideParts = [];
            sideLength = this.length/2 - 2 * this.sideHoleLength;
            geometry = new THREE.CubeGeometry(sideLength, this.sideHeight, this.sideWidth);

            createSideElement = function(geometry, material) {
                return new Physijs.BoxMesh(
                    geometry,
                    Physijs.createMaterial(
                        material,
                        this.sideFriction,
                        this.sideRestitution
                    ), 0
                );
            }.bind(this);

            //length side 1
            sideMesh = createSideElement(geometry, material);
            sideMesh.position.set(-sideLength/2 - this.sideHoleLength/2, 0, this.width/2 - this.sideWidth/2);
            sideParts.push(sideMesh);

            //length side 2
            material = new THREE.MeshLambertMaterial({ color: color, map: texture });
            sideMesh = createSideElement(geometry, material);
            sideMesh.position.set(-sideLength/2  - this.sideHoleLength/2, 0, -this.width/2 + this.sideWidth/2);
            sideParts.push(sideMesh);
//
//            //length side 3
            material = new THREE.MeshLambertMaterial({ color: color, map: texture });
            sideMesh = createSideElement(geometry, material);
            sideMesh.position.set(sideLength/2 + this.sideHoleLength/2, 0, this.width/2 - this.sideWidth/2);
            sideParts.push(sideMesh);
//
//            //length side 4
            material = new THREE.MeshLambertMaterial({ color: color, map: texture });
            sideMesh = createSideElement(geometry, material);
            sideMesh.position.set(sideLength/2 + this.sideHoleLength/2, 0, -this.width/2 + this.sideWidth/2);
            sideParts.push(sideMesh);
//
            sideLength = this.width/2 - 2 * this.sideHoleLength;
            geometry = new THREE.CubeGeometry(this.width - 2 * this.sideHoleLength, this.sideHeight, this.sideWidth);
//
//            //width side 1
            material = new THREE.MeshLambertMaterial({ color: color, map: texture });
            sideMesh = createSideElement(geometry, material);
            sideMesh.position.set(- this.length/2 + this.sideWidth/2, - sideLength/2 + this.sideHoleLength ,0);
            sideMesh.rotation.y = Math.PI/2;
            sideParts.push(sideMesh);
//
//            //width side 1
            material = new THREE.MeshLambertMaterial({ color: color, map: texture });
            sideMesh = createSideElement(geometry, material);
            sideMesh.position.set(this.length/2 - this.sideWidth/2, - sideLength/2 + this.sideHoleLength ,0);
            sideMesh.rotation.y = Math.PI/2;
            sideParts.push(sideMesh);


            _.each(sideParts, function (sideMesh) {
                sideMesh.position.y = this.gamePlaneHeight + this.sideHeight/2;
                dr.scene.add(sideMesh);
            }.bind(this));
        }

    };
    return table;
});