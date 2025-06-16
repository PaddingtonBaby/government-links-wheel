const canvas = document.getElementById('cloudCanvas');
        const ctx = canvas.getContext('2d');
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        ctx.imageSmoothingEnabled = false;
        
        const clouds = [];
        
        class PixelCloud {
            constructor(x, y, size = 1, speed = 1) {
                this.x = x;
                this.y = y;
                this.size = size;
                this.speed = speed;
                this.opacity = Math.random() * 0.3 + 0.7;
                
                this.pattern = this.generateCloudPattern();
                this.width = this.pattern[0].length * 8 * size;
                this.height = this.pattern.length * 8 * size;
                
                const colors = ['#FFFFFF', '#F0F8FF', '#E6F3FF'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
            
            generateCloudPattern() {
                const patterns = [
                    [
                        [0,0,1,1,1,1,1,1,0,0,1,1,1,1,1,0,0],
                        [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
                        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                        [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0]
                    ],
                    [
                        [0,1,1,1,0,0,1,1,1,1,0,0,1,1,1,0],
                        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                        [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0]
                    ],
                    [
                        [0,0,1,1,0,1,1,1,0,1,1,0,0],
                        [0,1,1,1,1,1,1,1,1,1,1,1,0],
                        [1,1,1,1,1,1,1,1,1,1,1,1,1],
                        [0,1,1,1,1,1,1,1,1,1,1,1,0]
                    ],
                    [
                        [0,1,1,0,0,1,1,1,0,0,1,1,1,0,0],
                        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                        [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0]
                    ]
                ];
                
                return patterns[Math.floor(Math.random() * patterns.length)];
            }
            
            update() {
                this.x -= this.speed;
                
                if (this.x + this.width < 0) {
                    this.x = canvas.width + Math.random() * 200;
                    this.y = Math.random() * (canvas.height * 0.4);
                }
            }
            
            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                
                const colors = ['#FFFFFF', '#F0F8FF', '#E6F3FF'];
                const shadowColor = '#D3D3D3';
                
                // Рисуем тень
                ctx.fillStyle = shadowColor;
                for (let row = 0; row < this.pattern.length; row++) {
                    for (let col = 0; col < this.pattern[row].length; col++) {
                        if (this.pattern[row][col] === 1) {
                            const pixelX = this.x + col * 8 * this.size + 2;
                            const pixelY = this.y + row * 8 * this.size + 2;
                            ctx.fillRect(pixelX, pixelY, 8 * this.size, 8 * this.size);
                        }
                    }
                }
                
                ctx.fillStyle = this.color;
                
                const cloudPixels = [];
                for (let row = 0; row < this.pattern.length; row++) {
                    for (let col = 0; col < this.pattern[row].length; col++) {
                        if (this.pattern[row][col] === 1) {
                            cloudPixels.push({
                                x: this.x + col * 8 * this.size,
                                y: this.y + row * 8 * this.size
                            });
                        }
                    }
                }
                
                if (cloudPixels.length > 0) {
                    ctx.beginPath();
                    cloudPixels.forEach((pixel, index) => {
                        if (index === 0) {
                            ctx.moveTo(pixel.x, pixel.y);
                        }
                        ctx.rect(pixel.x, pixel.y, 8 * this.size, 8 * this.size);
                    });
                    ctx.fill();
                }
                
                ctx.restore();
            }
        }
        
        function createInitialClouds() {
            for (let i = 0; i < 4; i++) {
                const cloud = new PixelCloud(
                    Math.random() * canvas.width * 1.5,
                    Math.random() * (canvas.height * 0.3),
                    Math.random() * 1.2 + 0.6,
                    Math.random() * 1 + 0.3
                );
                clouds.push(cloud);
            }
        }
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            clouds.forEach(cloud => {
                cloud.update();
                cloud.draw();
            });
            
            if (Math.random() < 0.001) {
                const cloud = new PixelCloud(
                    canvas.width + Math.random() * 300,
                    Math.random() * (canvas.height * 0.3),
                    Math.random() * 1.2 + 0.6,
                    Math.random() * 1 + 0.3
                );
                clouds.push(cloud);
            }
            
            if (clouds.length > 6) {
                clouds.splice(0, clouds.length - 6);
            }
            
            requestAnimationFrame(animate);
        }
        
        createInitialClouds();
        animate();