export const CRT_FRAGMENT_SHADER = `
precision highp float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uInputResolution;

// CRT Parameters
uniform float uBarrelDistortion;
uniform float uVignetteIntensity;
uniform float uVignetteRoundness;
uniform float uScanlineIntensity;
uniform float uScanlineCount;
uniform float uScanlineSpeed;
uniform float uRgbOffset;
uniform float uBrightness;
uniform float uContrast;
uniform float uSaturation;
uniform float uFlickerIntensity;
uniform float uNoiseIntensity;
uniform float uCornerRadius;
uniform float uCornerSharpness;
uniform float uPhosphorIntensity;
uniform float uBloomIntensity;
uniform float uCurvatureX;
uniform float uCurvatureY;
uniform float uScreenGlow;
uniform float uInterlaceIntensity;

// ---- Utility Functions ----

// High quality noise
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

// Barrel/Pincushion distortion
vec2 distort(vec2 uv) {
    vec2 cc = uv - 0.5;
    
    // Account for aspect ratio in distortion
    float aspect = uResolution.x / uResolution.y;
    cc.x *= aspect;
    
    float dist = dot(cc, cc);
    
    // Separate X and Y curvature
    vec2 curvature = vec2(uCurvatureX, uCurvatureY);
    cc = cc * (1.0 + dist * curvature * uBarrelDistortion);
    
    // Restore aspect ratio
    cc.x /= aspect;
    
    return cc + 0.5;
}

// Inverse distortion for proper screen bounds
vec2 distortInverse(vec2 uv) {
    vec2 cc = uv - 0.5;
    float aspect = uResolution.x / uResolution.y;
    cc.x *= aspect;
    
    float dist = dot(cc, cc);
    vec2 curvature = vec2(uCurvatureX, uCurvatureY);
    cc = cc / (1.0 + dist * curvature * uBarrelDistortion * 0.5);
    
    cc.x /= aspect;
    return cc + 0.5;
}

// Rounded rectangle distance field
float roundBox(vec2 p, vec2 b, float r) {
    vec2 d = abs(p) - b + r;
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
}

// Screen boundary mask with rounded corners
float screenMask(vec2 uv) {
    vec2 pos = (uv - 0.5) * 2.0;
    
    // Account for aspect ratio in corner rounding
    float aspect = uResolution.x / uResolution.y;
    pos.x *= aspect;
    vec2 bounds = vec2(aspect, 1.0);
    
    // Calculate distance from rounded box
    float d = roundBox(pos, bounds, uCornerRadius);
    
    // Sharp edge with very slight anti-aliasing
    return 1.0 - smoothstep(0.0, uCornerSharpness, d);
}

// ---- Main CRT Effect ----

void main() {
    vec2 uv = vTextureCoord;
    vec2 originalUV = uv;
    
    // Apply barrel distortion
    vec2 distortedUV = distort(uv);
    
    // Calculate screen mask
    float mask = screenMask(distortedUV);
    
    // Early exit for pixels outside the screen
    if (mask < 0.001) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }
    
    // Check if distorted UV is in valid range
    if (distortedUV.x < 0.0 || distortedUV.x > 1.0 || distortedUV.y < 0.0 || distortedUV.y > 1.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }
    
    // ---- Chromatic Aberration ----
    float aberrationAmount = uRgbOffset * (1.0 + pow(length(distortedUV - 0.5), 2.0) * 2.0);
    
    vec2 dir = normalize(distortedUV - 0.5);
    vec2 rOffset = dir * aberrationAmount;
    vec2 bOffset = -dir * aberrationAmount;
    
    vec2 rUV = distort(uv + rOffset * 0.5);
    vec2 gUV = distortedUV;
    vec2 bUV = distort(uv + bOffset * 0.5);
    
    float r = texture2D(uSampler, clamp(rUV, 0.0, 1.0)).r;
    float g = texture2D(uSampler, clamp(gUV, 0.0, 1.0)).g;
    float b = texture2D(uSampler, clamp(bUV, 0.0, 1.0)).b;
    
    vec3 color = vec3(r, g, b);
    
    // ---- Phosphor Mask (RGB Triad) - Enhanced for AAA quality ----
    vec2 phosphorCoord = distortedUV * uInputResolution;
    
    // Create authentic RGB phosphor pattern (shadow mask style)
    vec3 phosphorMask;
    float pixelY = mod(floor(phosphorCoord.y), 2.0);
    
    // Staggered phosphor pattern (like real CRT shadow mask)
    float offset = pixelY * 1.5;
    float px = mod(phosphorCoord.x + offset, 3.0);
    
    // Sharper, more defined phosphor dots
    phosphorMask.r = smoothstep(0.2, 0.4, px) * smoothstep(1.2, 1.0, px);
    phosphorMask.g = smoothstep(1.2, 1.4, px) * smoothstep(2.2, 2.0, px);
    phosphorMask.b = smoothstep(2.2, 2.4, px) * (1.0 - smoothstep(2.9, 3.0, px)) + smoothstep(-0.3, 0.0, px) * smoothstep(0.3, 0.0, px);
    
    // Add phosphor glow bleed for that authentic CRT look
    vec3 phosphorGlow = phosphorMask * 0.3;
    phosphorMask = phosphorMask * 1.2 + phosphorGlow;
    
    // Normalize and apply intensity with stronger effect
    phosphorMask = mix(vec3(1.0), phosphorMask * 1.8 + 0.4, uPhosphorIntensity);
    color *= phosphorMask;
    
    // ---- Scanlines - Enhanced for retro CRT quality ----
    float scanlineY = distortedUV.y * uScanlineCount;
    
    // Sharper, more defined scanlines
    float scanline = sin(scanlineY * 6.28318530718) * 0.5 + 0.5;
    scanline = pow(scanline, 2.0); // Sharper falloff
    
    // Add scanline glow for that phosphor persistence effect
    float scanlineGlow = pow(sin(scanlineY * 6.28318530718) * 0.5 + 0.5, 0.8);
    
    // Interlace effect (alternating scanlines based on time)
    float interlace = mod(floor(scanlineY) + floor(uTime * 30.0), 2.0);
    interlace = mix(1.0, interlace * 0.15 + 0.85, uInterlaceIntensity);
    
    // Apply scanlines with glow
    color *= mix(1.0, 1.0 - scanline * uScanlineIntensity, 1.0);
    color += color * scanlineGlow * uScanlineIntensity * 0.1; // Phosphor glow
    color *= interlace;
    
    // Rolling scanline bar (very subtle)
    float rollingScanline = sin((distortedUV.y - uTime * uScanlineSpeed) * 5.0) * 0.5 + 0.5;
    rollingScanline = pow(rollingScanline, 8.0);
    color *= 1.0 - rollingScanline * 0.05;
    
    // ---- Vignette ----
    vec2 vignetteUV = (distortedUV - 0.5) * 2.0;
    vignetteUV.x *= uVignetteRoundness;
    float vignetteDist = length(vignetteUV);
    float vignette = 1.0 - pow(vignetteDist * 0.7, 2.5) * uVignetteIntensity;
    vignette = clamp(vignette, 0.0, 1.0);
    color *= vignette;
    
    // ---- Screen Glow / Bloom - Enhanced, biased toward bright (near-white) content ----
    vec3 bloomSample = texture2D(uSampler, distortedUV).rgb;
    
    // Multi-pass bloom for that authentic neon glow
    vec3 bloomAccum = vec3(0.0);
    float bloomRadius = 0.0035;
    for(float i = 0.0; i < 8.0; i++) {
        float angle = i * 0.785398; // 45 degrees
        vec2 offset = vec2(cos(angle), sin(angle)) * bloomRadius * (1.0 + i * 0.3);
        bloomAccum += texture2D(uSampler, distortedUV + offset).rgb;
    }
    vec3 bloom = bloomAccum / 8.0;
    
    // Compute luminance so bright/white pixels drive bloom harder
    float bloomLuma = dot(bloomSample, vec3(0.299, 0.587, 0.114));
    float whiteBoost = smoothstep(0.6, 1.0, bloomLuma); // only really bright text/lines
    
    // Enhance bright colors for neon pop, with extra strength where whiteBoost is high
    bloom = pow(bloom, vec3(1.3)) * uBloomIntensity * (1.6 + whiteBoost * 1.4);
    
    // Add chromatic bloom separation for that cassette futurism look
    vec3 chromaticBloom;
    chromaticBloom.r = texture2D(uSampler, distortedUV + vec2(bloomRadius * 0.5, 0.0)).r;
    chromaticBloom.g = bloom.g;
    chromaticBloom.b = texture2D(uSampler, distortedUV - vec2(bloomRadius * 0.5, 0.0)).b;
    
    bloom = mix(bloom, chromaticBloom, 0.3);
    color += bloom * 0.55;
    
    // ---- Flicker ----
    // Subtle high-frequency flicker combined with 60Hz hum
    float flicker = 1.0 + (hash(vec2(uTime * 113.0, 0.0)) - 0.5) * uFlickerIntensity * 0.5;
    flicker *= 1.0 + sin(uTime * 60.0) * (uFlickerIntensity * 0.2);
    color *= flicker;
    
    // ---- Film Grain / Noise ----
    float grainTime = uTime * 15.0;
    float grain = hash(distortedUV * uInputResolution + vec2(grainTime, grainTime * 0.7));
    grain = (grain - 0.5) * uNoiseIntensity;
    color += grain;
    
    // ---- Color Adjustments ----
    // Saturation
    float luma = dot(color, vec3(0.299, 0.587, 0.114));
    color = mix(vec3(luma), color, uSaturation);
    
    // Contrast
    color = (color - 0.5) * uContrast + 0.5;
    
    // Brightness
    color *= uBrightness;
    
    // ---- Screen Glass Reflection - Enhanced for realism ----
    // Vertical light streak (like fluorescent light reflection)
    float reflection = pow(max(0.0, 1.0 - abs(distortedUV.x - 0.25) * 4.0), 4.0);
    reflection *= pow(max(0.0, 1.0 - distortedUV.y * 0.8), 3.0);
    reflection *= 0.03;
    
    // Add subtle horizontal reflection
    float hReflection = pow(max(0.0, 1.0 - abs(distortedUV.y - 0.15) * 5.0), 3.0);
    hReflection *= pow(max(0.0, 1.0 - abs(distortedUV.x - 0.5) * 2.0), 2.0);
    hReflection *= 0.015;
    
    color += vec3(reflection + hReflection) * vec3(0.8, 1.0, 1.2); // Slight cyan tint
    
    // ---- Corner Shadow & Vignette Enhancement ----
    float cornerShadow = smoothstep(0.0, 0.2, mask);
    color *= mix(0.5, 1.0, cornerShadow);
    
    // Add subtle edge glow (phosphor persistence at edges)
    float edgeGlow = smoothstep(0.95, 1.0, mask) * (1.0 - smoothstep(0.98, 1.0, mask));
    color += vec3(0.0, 1.0, 0.8) * edgeGlow * 0.1;
    
    // Apply final mask
    color *= mask;
    
    gl_FragColor = vec4(color, 1.0);
} `;

export const CRT_VERTEX_SHADER = `
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main() {
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}
`;

export class CRTFilter extends PIXI.Filter {
    constructor(options = {}) {
        super(CRT_VERTEX_SHADER, CRT_FRAGMENT_SHADER);
        
        this.uniforms.uTime = 0;
        this.uniforms.uResolution = [1024, 768];
        this.uniforms.uInputResolution = [1024, 768];
        
        // Default CRT parameters - tuned for readability and aesthetics
        this.uniforms.uBarrelDistortion = options.barrelDistortion ?? 0.12;
        this.uniforms.uVignetteIntensity = options.vignetteIntensity ?? 0.4;
        this.uniforms.uVignetteRoundness = options.vignetteRoundness ?? 1.2;
        this.uniforms.uScanlineIntensity = options.scanlineIntensity ?? 0.15;
        this.uniforms.uScanlineCount = options.scanlineCount ?? 768;
        this.uniforms.uScanlineSpeed = options.scanlineSpeed ?? 0.03;
        this.uniforms.uRgbOffset = options.rgbOffset ?? 0.0012;
        this.uniforms.uBrightness = options.brightness ?? 1.15;
        this.uniforms.uContrast = options.contrast ?? 1.1;
        this.uniforms.uSaturation = options.saturation ?? 1.2;
        this.uniforms.uFlickerIntensity = options.flickerIntensity ?? 0.02;
        this.uniforms.uNoiseIntensity = options.noiseIntensity ?? 0.04;
        this.uniforms.uCornerRadius = options.cornerRadius ?? 0.08;
        this.uniforms.uCornerSharpness = options.cornerSharpness ?? 0.02;
        this.uniforms.uPhosphorIntensity = options.phosphorIntensity ?? 0.25;
        this.uniforms.uBloomIntensity = options.bloomIntensity ?? 0.3;
        this.uniforms.uCurvatureX = options.curvatureX ?? 1.0;
        this.uniforms.uCurvatureY = options.curvatureY ?? 1.0;
        this.uniforms.uScreenGlow = options.screenGlow ?? 0.8;
        this.uniforms.uInterlaceIntensity = options.interlaceIntensity ?? 0.03;
    }
    
    update(deltaTime) {
        this.uniforms.uTime += deltaTime * 0.001;
    }
    
    setResolution(width, height) {
        this.uniforms.uResolution = [width, height];
        this.uniforms.uInputResolution = [width, height];
        this.uniforms.uScanlineCount = height;
    }
}
