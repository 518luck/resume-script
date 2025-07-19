/**
 * 判断当前是否为开发环境
 *
 * 通过检查 NODE_ENV 环境变量来判断当前运行环境。
 * 当 NODE_ENV 设置为 'development' 时返回 true，否则返回 false。
 *
 * @returns {boolean} 如果是开发环境返回 true，否则返回 false
 *
 * @example
 * // 开发环境
 * if (isDev()) {
 *   console.log('当前在开发环境')
 *   // 启用热重载、开发者工具等开发功能
 * }
 *
 * @example
 * // 生产环境
 * if (!isDev()) {
 *   console.log('当前在生产环境')
 *   // 禁用调试功能，优化性能
 * }
 *
 * @since 1.0.0
 */
export function isDev(): boolean {
  return process.env.NODE_ENV === 'development'
}
