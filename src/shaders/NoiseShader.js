export const NOISE_FRAGMENT_SHADER = `
precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float uNoiseLevel;
uniform float uTime;

// High quality noise function
float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    return mix(
        mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
        f.y
    );
}

void main() {
    vec2 uv = vTextureCoord;
    
    // Sample the base image
    vec4 color = texture2D(uSampler, uv);
    
    // Generate multi-octave noise
    vec2 noiseCoord = uv * 100.0 + vec2(uTime * 0.1, uTime * 0.15);
    float n = 0.0;
    n += noise(noiseCoord) * 0.5;
    n += noise(noiseCoord * 2.0) * 0.25;
    n += noise(noiseCoord * 4.0) * 0.125;
    n += noise(noiseCoord * 8.0) * 0.0625;
    
    // Apply noise based on noise level
    float noiseIntensity = uNoiseLevel * 0.8;
    vec3 noiseColor = vec3(n);
    
    // Mix between clear image and noise
    vec3 finalColor = mix(color.rgb, noiseColor, noiseIntensity);
    
    // Add static flickering
    float flicker = hash(vec2(uTime * 123.456, uv.y * 789.012)) * 0.1 * uNoiseLevel;
    finalColor += flicker;
    
    gl_FragColor = vec4(finalColor, color.a);
}
`;

export const NOISE_VERTEX_SHADER = `
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main() {
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}
`;

export class NoiseFilter extends PIXI.Filter {
    constructor() {
        super(NOISE_VERTEX_SHADER, NOISE_FRAGMENT_SHADER);
        
        this.uniforms.uNoiseLevel = 1.0;
        this.uniforms.uTime = 0;
    }
    
    setNoiseLevel(level) {
        this.uniforms.uNoiseLevel = Math.max(0, Math.min(1, level));
    }
    
    update(deltaTime) {
        this.uniforms.uTime += deltaTime * 0.001;
    }
}
