import { ShaderColorLayer } from '@jdultra/ultra-globe';
/**
 * A color layer where the color is a function of the terrain steepness.
 * @class
 * @extends ShaderColorLayer
 */
class CustomShaderLayer extends ShaderColorLayer{
    /**
     * A color layer where the color is fully computed in the shader.
     * The given shader glsl code will be inserted in the main planet shader and 
     * color per fragment will be computed via a call to "vec3 getShaderLayerColor(vec3 llh, vec3 xyz, vec3 normal, float level);"
     * 
     * Only one visible ShaderColorLayer will be taken into account at a time.
     * 
     * @param {Object} properties 
     * @param {String|Number} properties.id layer id should be unique
     * @param {String} properties.name the name can be anything you want and is intended for labeling
     * @param {Number} properties.transparency the layer's transparency (0 to 1)
     * @param {Number[]} [properties.bounds=[-180, -90, 180, 90]]  min longitude, min latitude, max longitude, max latitude in degrees
     * @param {Boolean} [properties.visible = true] layer will be rendered if true (true by default)
     * 
     */
    constructor(properties) {
        properties.shader = `
            vec3 getShaderLayerColor(vec3 llh, vec3 xyz, vec3 normal, float level){
                float slope = pow(dot(normalize(xyz), normal),2.0);

                return vec3(slope, 0.0,1.0-slope);
            }
        `;
        super(properties);
    }
}
export {CustomShaderLayer}