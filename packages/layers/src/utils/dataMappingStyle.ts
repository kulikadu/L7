import {
  gl,
  ILayer,
  IStyleAttributeUpdateOptions,
  ITexture2D,
  StyleAttributeField,
  StyleAttributeOption,
} from '@antv/l7-core';
import { rgb2arr } from '@antv/l7-utils';
import { isArray, isFunction, isNumber, isString } from 'lodash';
/**
 * 该文件中的工具方法主要用于对 style 中的属性进行 数据映射
 */

interface IConfigToUpdate {
  opacity?: any;
  strokeOpacity?: any;
  stroke?: any;
  strokeWidth?: any;
  offsets?: any;
}

// 画布默认的宽度
const WIDTH = 1024;

/**
 * 当 style 中使用的 opacity 不是常数的时候根据数据进行映射
 * @param field
 * @param values
 * @param updateOptions
 */
function registerStyleAttribute(
  fieldName: string,
  layer: ILayer,
  field: StyleAttributeField,
  values?: StyleAttributeOption,
  updateOptions?: Partial<IStyleAttributeUpdateOptions>,
) {
  layer.updateStyleAttribute(fieldName, field, values, updateOptions);
}

/**
 * 当样式发生变化时判断是否需要进行数据映射
 * @param configToUpdate
 * @param layer
 */
function handleStyleDataMapping(configToUpdate: IConfigToUpdate, layer: any) {
  if (configToUpdate.opacity) {
    // 处理 style 中 opacity 属性的数据映射

    handleStyleFloat('opacity', layer, configToUpdate.opacity);
  }

  if (configToUpdate.strokeWidth) {
    // 处理 style 中 strokeWidth 属性的数据映射

    handleStyleFloat('strokeWidth', layer, configToUpdate.strokeWidth);
  }

  if (configToUpdate.strokeOpacity) {
    // 处理 style 中 strokeOpacity 属性的数据映射

    handleStyleFloat('strokeOpacity', layer, configToUpdate.strokeOpacity);
  }

  if (configToUpdate.stroke) {
    // 处理 style 中 stroke (strokeColor) 属性的数据映射
    handleStyleColor('stroke', layer, configToUpdate.stroke);
  }

  if (configToUpdate.offsets) {
    // 处理 style 中 offsets 属性的数据映射
    handleStyleOffsets('offsets', layer, configToUpdate.offsets);
  }
}

/**
 * 根据传入参数 float 的类型和值做相应的操作
 */
function handleStyleFloat(fieldName: string, layer: ILayer, styleFloat: any) {
  if (isString(styleFloat)) {
    // opacity = 'string'
    registerStyleAttribute(fieldName, layer, styleFloat, (value: any) => {
      return value;
    });
  } else if (isNumber(styleFloat)) {
    // opacity = 0.4 -> opacity 传入数字
    registerStyleAttribute(fieldName, layer, [styleFloat], undefined);
  } else if (isArray(styleFloat) && styleFloat.length === 2) {
    if (isString(styleFloat[0]) && isFunction(styleFloat[1])) {
      // opacity = ['string', callback]
      registerStyleAttribute(fieldName, layer, styleFloat[0], styleFloat[1]);
    } else if (
      isString(styleFloat[0]) &&
      isArray(styleFloat[1]) &&
      isNumber(styleFloat[1][0]) &&
      isNumber(styleFloat[1][1])
    ) {
      // opacity = ['string', [start: number, end: nuber]]
      registerStyleAttribute(fieldName, layer, styleFloat[0], styleFloat[1]);
    } else {
      registerStyleAttribute(fieldName, layer, [1.0], undefined);
    }
  } else {
    registerStyleAttribute(fieldName, layer, [1.0], undefined);
  }
}
/**
 * 根据传入参数 offsets 的类型和值做相应的操作
 * @param fieldName
 * @param layer
 * @param styleOffsets
 */
function handleStyleOffsets(
  fieldName: string,
  layer: ILayer,
  styleOffsets: any,
) {
  if (isString(styleOffsets)) {
    // 字符串
    registerStyleAttribute(fieldName, layer, styleOffsets, (value: any) => {
      return value;
    });
  } else if (
    isArray(styleOffsets) &&
    styleOffsets.length === 2 &&
    isString(styleOffsets[0]) &&
    isFunction(styleOffsets[1])
  ) {
    // callback
    registerStyleAttribute(fieldName, layer, styleOffsets[0], styleOffsets[1]);
  } else if (
    isArray(styleOffsets) &&
    styleOffsets.length === 2 &&
    isNumber(styleOffsets[0]) &&
    isNumber(styleOffsets[1])
  ) {
    // normal
    registerStyleAttribute(fieldName, layer, styleOffsets, undefined);
  } else {
    registerStyleAttribute(fieldName, layer, [0, 0], undefined);
  }
}

/**
 * 根据传入参数 stroke / color 的类型和值做相应的操作
 * @param fieldName
 * @param layer
 * @param styleColor
 */
function handleStyleColor(fieldName: string, layer: ILayer, styleColor: any) {
  if (isString(styleColor)) {
    registerStyleAttribute(fieldName, layer, styleColor, undefined);
  } else if (isArray(styleColor) && styleColor.length === 2) {
    if (isString(styleColor[0]) && isFunction(styleColor[1])) {
      registerStyleAttribute(fieldName, layer, styleColor[0], styleColor[1]);
    } else if (
      isString(styleColor[0]) &&
      isArray(styleColor[1]) &&
      styleColor[1].length > 0
    ) {
      registerStyleAttribute(fieldName, layer, styleColor[0], styleColor[1]);
    } else {
      registerStyleAttribute(fieldName, layer, '#fff', undefined);
    }
  } else {
    registerStyleAttribute(fieldName, layer, '#fff', undefined);
  }
}

export { handleStyleDataMapping, handleStyleFloat, handleStyleColor };
