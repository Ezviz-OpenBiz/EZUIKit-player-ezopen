import * as _ezuikit_utils_service_dist_types_fetch from '@ezuikit/utils-service/dist/types/fetch';
import { LoggerCls } from '@ezuikit/utils-logger/dist/types/logger';
import { LoggerOptions } from '@ezuikit/utils-logger';
import I18n from '@ezuikit/utils-i18n';
import Service, { DeviceCapacityRes, DeviceInfoRes } from '@ezuikit/utils-service';
import { EzopenURL } from '@ezuikit/utils-tools';
import EventEmitter from 'eventemitter3';

interface IResult$1<T> {
    data?: T;
    code?: number;
    msg?: string;
}
/**
 * 播放器标准接口
 */
interface PlayerInterface {
    playing: boolean;
    volume: number;
    playbackRate: number;
    deviceCapacity: Record<string, any>;
    i18n: any;
    logger: any;
    event: EventEmitter;
    /**
     * 播放
     * @param options
     * @returns {Promise}
     */
    play: (options?: any) => Promise<unknown>;
    /**
     * 暂停播放
     * @returns
     */
    pause: (bool?: boolean) => Promise<unknown>;
    /**
     * 销毁并断流
     * @returns
     */
    destroy: () => Promise<unknown>;
    /**
     * 截图
     * @param {string} name 文件名 默认时间戳（new Date().getTime()）
     * @param {"png" | "jpeg"} fmt 图片格式
     * @param {"base64"} type 文件格式 默认base64
     * @param {boolean} download 是否直接下载 默认不直接下载
     * @returns 返回base64字符
     */
    snapshot: (name?: string, fmt?: 'jpeg', type?: 'base64', download?: boolean) => Promise<IResult$1<{
        fileName?: string;
        base64?: string;
    } | null>>;
    /**
     * 开始录制视频
     * @param {string} name 文件名 默认时间戳（new Date().getTime()）
     * @param {"mp4"} fmt 图片格式 默认mp4
     * @returns
     */
    startRecord?: (name?: string, fmt?: 'mp4') => Promise<any>;
    /**
     * 停止录制
     * @returns
     */
    stopRecord?: () => Promise<any>;
    /**
     * 全屏
     * @returns
     */
    fullScreen: () => Promise<void>;
    /**
     * 退出全屏
     * @returns
     */
    exitScreen: () => Promise<void>;
    /**
     * 设置画布/视频的尺寸  不设置 默认使用容器的高宽（充满容器）
     * @param {number=} width 画布的宽度
     * @param {number=} height 画布的高度
     * @returns
     */
    resize: (width?: number, height?: number) => Promise<{
        width: number;
        height: number;
    }>;
    /**
     * 设置音量
     * @param volume 音量 [0-1]， 0：表示静音
     * @returns {void}
     */
    setVolume: (volume: number) => void;
    /**
     * 设置封面
     * @param url
     * @returns
     */
    setPoster?: (postUrl: string) => void;
    /**
     * 设置播放速度
     * @param rate
     * @returns
     */
    setPlaybackRate?: (rate: number) => void;
    /**
     * 当前版本号
     * @returns
     */
    getVersion: () => object;
    /**
     * 设置日志打印的级别 INFO | LOG | WARN | ERROR
     *
     *
     * @param {string} level 日志级别 一次从大到小 3 -> 0 (为了更好的扩展)
     * @returns
     */
    setDebug?: (level: 'INFO' | 'LOG' | 'WARN' | 'ERROR') => void;
}

interface PlayerPlugin {
    name: string;
    init?: (player?: PlayerInterface) => void;
    beforeExec?: (player?: PlayerInterface) => boolean | Promise<boolean>;
    exec: (player?: PlayerInterface) => void;
    afterExec?: (player?: PlayerInterface) => void;
    destroy?: (player?: PlayerInterface) => void;
}

/**
 * 环境
 */
interface PlayerEnv {
    domain: string;
    wsUrl?: string;
}
interface PlayerOptions {
    /**
     * dom id
     */
    id: string;
    /**
     * 视频封面
     */
    poster?: string;
    /**
     * 播放地址
     */
    url: string;
    /**
     *
     */
    accessToken?: string;
    /**
     * 自动播放
     */
    autoPlay?: boolean;
    /**
     * 是否开启音频
     */
    audio?: boolean;
    /**
     * 环境变量
     */
    env?: PlayerEnv;
    /**
     * 打开流信息回调，监听 streamInfoCB 事件
     * 0 : 每次都回调
     * 1 : 只回调一次
     * 注意：会影响性能
     * 默认值 1
     */
    streamInfoCBType: 0 | 1;
}
interface IResult<T> {
    data?: T;
    code?: number;
    msg?: string;
}
interface IFrameInfo {
    codecType: number;
    videoFormatName?: string;
    width: number;
    height: number;
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
}

interface IStreamClient {
    /**
     * @description 开流, 此时设备的流还没有发出来
     * @param {string} szUrl 取流路径，如ws://hostname:port/channel
     * @param {object} oParams 取流需要涉及的相关参数
     * @param {function} cbMessage 消息回调函数
     * @param {function} cbClose 关闭回调
     * @returns {Promise<string>} 返回Promise对象 // 取流uuid，用于区分每条取流连接
     */
    openStream: (szUrl: string, oParams: object, cbMessage: (msg: object) => void, cbClose: (id?: string, closeInfo?: {
        code?: number;
        reason?: string;
        wasClean?: boolean;
    }) => void) => Promise<string>;
    /**
     * @description 开始取流
     *
     * @param {string} id websocket id，在openStream的时候生成
     * @param {string} szStartTime 开始时间
     * @param {string} szStopTime 结束时间
     * @param {function} cbMessage 码流回调函数
     *
     * @returns {Promise<unknown>} 返回Promise对象
     */
    startPlay: (id: string, szStartTime?: string, szStopTime?: string) => Promise<unknown>;
    singleFrame: () => void;
    /**
     * @description 设置倍率
     *
     * @param {string} id websocket id在openStream的时候生成
     * @param {number} iRate 播放倍率
     *
     * @returns {Promise<unknown>} Promise
     */
    setPlayRate: (id: string, iRate: number) => Promise<unknown>;
    /**
     * @description 定位回放
     *
     * @param {string} id websocket id在openStream的时候生成
     * @param {string} szStartTime 开始时间
     * @param {string} szStopTime 结束时间
     *
     * @returns {Promise<unknown>} Promise
     */
    seek: (id: string, szStartTime: string, szStopTime: string) => Promise<unknown>;
    /**
     * @description 暂停取流
     *
     * @param {string} id websocket id，在openStream的时候生成
     *
     * @returns {Promise<unknown>} 返回Promise对象
     */
    pause: (id: string) => Promise<unknown>;
    /**
     * @description 透传协议
     *
     * @param {string} id websocket id，在openStream的时候生成
     * @param {string} szCmd, 透传的命令码
     *
     * @returns {Promise<unknown>} 返回Promise对象
     */
    transmission: (id: string, szCmd: string) => Promise<unknown>;
    /**
     * @description 恢复取流
     *
     * @param {string} id websocket id，在openStream的时候生成
     *
     * @returns {Promise<unknown>} 返回Promise对象
     */
    resume: (id: string) => Promise<unknown>;
    /**
     * @description 停止取流
     *
     * @param {string} id websocket id，在openStream的时候生成
     *
     * @returns {Promise<unknown>} 返回Promise对象
     */
    stop: (id: string) => Promise<unknown>;
    stopAll: () => Promise<unknown>;
}
declare class StreamClient {
    private readonly _player;
    private _streamClient;
    _streamUUID: string;
    constructor(player: EZopenPlayer);
    /**
     * @description 开流, 此时设备的流还没有发出来
     * @param {string} szUrl 取流路径，如ws://hostname:port/channel
     * @param {object} oParams 取流需要涉及的相关参数
     * @param {function} cbMessage 消息回调函数
     * @param {function} cbClose 关闭回调
     * @param {function} cbError 错误回调
     * @returns {Promise<string>} 返回Promise对象 // 取流uuid，用于区分每条取流连接
     */
    openStream(szUrl: string, oParams: object, cbMessage: (msg: object) => void, cbClose: (id?: string, closeInfo?: {
        code?: number;
        reason?: string;
        wasClean?: boolean;
    }) => void, cbError: (id?: string, msg?: any) => void): Promise<string>;
    /**
     * @description 开始取流
     *
     * @param {string} id websocket id，在openStream的时候生成
     * @param {string} szStartTime 开始时间
     * @param {string} szStopTime 结束时间
     * @param {function} cbMessage 码流回调函数
     *
     * @returns {Promise<unknown>} 返回Promise对象
     */
    startPlay(id?: string): Promise<void>;
    /**
     * @description 设置播放速度
     * @param rate 播放速度
     * @param uuid websocket id，在openStream的时候生成
     * @returns
     */
    setPlayRate(rate: number, id?: string): Promise<void>;
    /**
     * @description 定位回放
     *
     * @param {string} id websocket id在openStream的时候生成
     * @param {string} startTime 开始时间
     * @param {string} stopTime 结束时间
     *
     * @returns {Promise<unknown>} Promise
     */
    seek(startTime: string, stopTime: string, id?: string): Promise<void>;
    /**
     * @description 停止所有流
     * @returns
     */
    stopAll(): Promise<void>;
    /**
     * @description 客户端销毁
     */
    destroy(): void;
}

declare class ESCanvas {
  constructor(szCanvasId: any);
  m_iCanvasWidth: any;
  m_iCanvasHeight: any;
  m_iHorizontalResolution: number;
  m_iVerticalResolution: number;
  m_szDisplayMode: string;
  m_szVideoFormat: string;
  setDrawMutiShapeOneTime(bDrawMuti: any): void;
  setMaxShapeSupport(iMax: any): void;
  getMaxShapeSupport(): number;
  setDrawStatus(bDrawStatus: any, cbCallback?: any): void;
  setShapeType(szType: any): void;
  setCurrentShapeInfo(oShapeInfo: any): void;
  getShapeType(): string;
  getAllShapesInfo(): (
    | {
        szType: any;
        szGridMap: any;
        iGridColNum: any;
        iGridRowNum: any;
        szText?: undefined;
        szEnabled?: undefined;
        szOSDType?: undefined;
        iPositionX?: undefined;
        iPositionY?: undefined;
        szDateStyle?: undefined;
        szClockType?: undefined;
        szDisplayWeek?: undefined;
        szId?: undefined;
        szAlignment?: undefined;
        aPoint?: undefined;
        bChoosed?: undefined;
      }
    | {
        szType: any;
        szText: any;
        szEnabled: any;
        szOSDType: any;
        iPositionX: any;
        iPositionY: any;
        szDateStyle: any;
        szClockType: any;
        szDisplayWeek: any;
        szId: any;
        szAlignment: any;
        szGridMap?: undefined;
        iGridColNum?: undefined;
        iGridRowNum?: undefined;
        aPoint?: undefined;
        bChoosed?: undefined;
      }
    | {
        szType: any;
        aPoint: any;
        szId: any;
        bChoosed: any;
        szGridMap?: undefined;
        iGridColNum?: undefined;
        iGridRowNum?: undefined;
        szText?: undefined;
        szEnabled?: undefined;
        szOSDType?: undefined;
        iPositionX?: undefined;
        iPositionY?: undefined;
        szDateStyle?: undefined;
        szClockType?: undefined;
        szDisplayWeek?: undefined;
        szAlignment?: undefined;
      }
  )[];
  deleteRepeatPolyonById(id: any): void;
  getShapesInfoByType(szType: any): (
    | {
        szType: any;
        szGridMap: any;
        iGridColNum: any;
        iGridRowNum: any;
        szText?: undefined;
        szEnabled?: undefined;
        szOSDType?: undefined;
        iPositionX?: undefined;
        iPositionY?: undefined;
        szDateStyle?: undefined;
        szClockType?: undefined;
        szDisplayWeek?: undefined;
        szId?: undefined;
        szAlignment?: undefined;
        iPolygonType?: undefined;
        iMinClosed?: undefined;
        iMaxPointNum?: undefined;
        iEditType?: undefined;
        aPoint?: undefined;
        bClosed?: undefined;
        szTips?: undefined;
        szDrawColor?: undefined;
        szFillColor?: undefined;
        iTranslucent?: undefined;
        iLineType?: undefined;
        iDirection?: undefined;
        iArrowType?: undefined;
        aCrossArrowPoint?: undefined;
      }
    | {
        szType: any;
        szText: any;
        szEnabled: any;
        szOSDType: any;
        iPositionX: any;
        iPositionY: any;
        szDateStyle: any;
        szClockType: any;
        szDisplayWeek: any;
        szId: any;
        szAlignment: any;
        szGridMap?: undefined;
        iGridColNum?: undefined;
        iGridRowNum?: undefined;
        iPolygonType?: undefined;
        iMinClosed?: undefined;
        iMaxPointNum?: undefined;
        iEditType?: undefined;
        aPoint?: undefined;
        bClosed?: undefined;
        szTips?: undefined;
        szDrawColor?: undefined;
        szFillColor?: undefined;
        iTranslucent?: undefined;
        iLineType?: undefined;
        iDirection?: undefined;
        iArrowType?: undefined;
        aCrossArrowPoint?: undefined;
      }
    | {
        szType: any;
        szId: any;
        iPolygonType: any;
        iMinClosed: any;
        iMaxPointNum: any;
        iEditType: any;
        aPoint: any;
        bClosed: any;
        szTips: any;
        szDrawColor: any;
        szFillColor: any;
        iTranslucent: any;
        szGridMap?: undefined;
        iGridColNum?: undefined;
        iGridRowNum?: undefined;
        szText?: undefined;
        szEnabled?: undefined;
        szOSDType?: undefined;
        iPositionX?: undefined;
        iPositionY?: undefined;
        szDateStyle?: undefined;
        szClockType?: undefined;
        szDisplayWeek?: undefined;
        szAlignment?: undefined;
        iLineType?: undefined;
        iDirection?: undefined;
        iArrowType?: undefined;
        aCrossArrowPoint?: undefined;
      }
    | {
        szType: any;
        szId: any;
        aPoint: any;
        szTips: any;
        iLineType: any;
        iDirection: any;
        iArrowType: any;
        szDrawColor: any;
        aCrossArrowPoint: any;
        szGridMap?: undefined;
        iGridColNum?: undefined;
        iGridRowNum?: undefined;
        szText?: undefined;
        szEnabled?: undefined;
        szOSDType?: undefined;
        iPositionX?: undefined;
        iPositionY?: undefined;
        szDateStyle?: undefined;
        szClockType?: undefined;
        szDisplayWeek?: undefined;
        szAlignment?: undefined;
        iPolygonType?: undefined;
        iMinClosed?: undefined;
        iMaxPointNum?: undefined;
        iEditType?: undefined;
        bClosed?: undefined;
        szFillColor?: undefined;
        iTranslucent?: undefined;
      }
    | {
        szType: any;
        iEditType: any;
        aPoint: any;
        szTips: any;
        szDrawColor: any;
        szFillColor: any;
        iTranslucent: any;
        szGridMap?: undefined;
        iGridColNum?: undefined;
        iGridRowNum?: undefined;
        szText?: undefined;
        szEnabled?: undefined;
        szOSDType?: undefined;
        iPositionX?: undefined;
        iPositionY?: undefined;
        szDateStyle?: undefined;
        szClockType?: undefined;
        szDisplayWeek?: undefined;
        szId?: undefined;
        szAlignment?: undefined;
        iPolygonType?: undefined;
        iMinClosed?: undefined;
        iMaxPointNum?: undefined;
        bClosed?: undefined;
        iLineType?: undefined;
        iDirection?: undefined;
        iArrowType?: undefined;
        aCrossArrowPoint?: undefined;
      }
    | {
        szType: any;
        aPoint: any;
        szGridMap?: undefined;
        iGridColNum?: undefined;
        iGridRowNum?: undefined;
        szText?: undefined;
        szEnabled?: undefined;
        szOSDType?: undefined;
        iPositionX?: undefined;
        iPositionY?: undefined;
        szDateStyle?: undefined;
        szClockType?: undefined;
        szDisplayWeek?: undefined;
        szId?: undefined;
        szAlignment?: undefined;
        iPolygonType?: undefined;
        iMinClosed?: undefined;
        iMaxPointNum?: undefined;
        iEditType?: undefined;
        bClosed?: undefined;
        szTips?: undefined;
        szDrawColor?: undefined;
        szFillColor?: undefined;
        iTranslucent?: undefined;
        iLineType?: undefined;
        iDirection?: undefined;
        iArrowType?: undefined;
        aCrossArrowPoint?: undefined;
      }
  )[];
  setShapesInfoByType(szType: any, aShapesInfo: any): void;
  addOSDShape(szText: any, szEnabled: any, iStartX: any, iStartY: any, oExtend: any): void;
  selectShapeById(szShapeType: any, szId: any): void;
  setCanvasSize(iWidth: any, iHeight: any): void;
  setDrawStyle(szBorderColor: any, szFillColor: any, iTranslucent: any): void;
  clearAllShape(): void;
  clearShapeByType(szType: any): void;
  deleteShape(iShapeIndex: any): void;
  updateCanvas(szCanvasId: any): void;
  resizeCanvas(): void;
  canvasRedraw(): void;
  [CANVAS]: any;
  [CONTEXT]: any;
  [SHAPES]: any[];
  [DRAWSTATUS]: boolean;
  [SHAPETYPE]: string;
  [MAXSHAPENUMSUPPORT]: number;
  [DRAWSHAPEMULTIONETIME]: boolean;
  [CURRENTSHAPEINFO]: {};
  [EVENTCALLBACK]: any;
  [SHAPESTYLE]: {
    szDrawColor: string;
    szFillColor: string;
    iTranslucent: number;
  };
  [POLYGONDRAWING]: boolean;
}
declare const CANVAS: unique symbol;
declare const CONTEXT: unique symbol;
declare const SHAPES: unique symbol;
declare const DRAWSTATUS: unique symbol;
declare const SHAPETYPE: unique symbol;
declare const MAXSHAPENUMSUPPORT: unique symbol;
declare const DRAWSHAPEMULTIONETIME: unique symbol;
declare const CURRENTSHAPEINFO: unique symbol;
declare const EVENTCALLBACK: unique symbol;
declare const SHAPESTYLE: unique symbol;
declare const POLYGONDRAWING: unique symbol;

declare const JSPlayCtrl: any;

interface IPlayerWindowOptions {
    eventEmitter?: EventEmitter | undefined;
    container: HTMLElement;
    id: string;
    width: number;
    height: number;
    onCurrentFullScreenChange?: (event: Event) => void;
    dpr?: number;
    style?: Record<string, string>;
    player: EZopenPlayer;
}
/**
 * @description 播放器窗口
 * @warn 后续会弱化 id
 */
declare class PlayerWindow {
    id: string;
    width: number;
    height: number;
    dpr: number;
    style: Record<string, string>;
    $playerWnd: HTMLDivElement;
    canvasId: string;
    _options: IPlayerWindowOptions;
    private _isCurrentFullscreen;
    private readonly _$container;
    private _resizeObserver;
    private readonly _player;
    constructor(options: IPlayerWindowOptions);
    /**
     * @description 渲染播放器窗口
     * @returns
     */
    private _render;
    /**
     * @description canvas 隐藏 （由于 v3 切换播放地址时 上个canvas 还在 页面resize canvas 会崩溃 变成白色， 使用改方法配合 reRenderCanvas）
     */
    hide(): void;
    /**
     * @description 销毁播放器窗口
     */
    destroy(): void;
    /**
     * @description 窗口resize
     * @param {number} width 窗口的宽 （画布， 不包括自定义主题）
     * @param {number} height 窗口的高 （画布， 不包括自定义主题）
     * @returns {void}
     */
    resize(width: number, height: number): void;
    private _resizeCanvas;
    /**
     *
     * @param {boolean} remove 是否移除
     * @returns
     */
    reRenderCanvas(remove?: boolean): void;
    /**
     * @description 全局全屏(当前节点)
     * @param {number} width resize 当前画布的宽 (不存在 需手动resize)
     * @param {number} height resize 当前画布的高 (不存在 需手动resize)
     * @returns {Promise<unknown>}
     */
    fullscreen(width?: number, height?: number): Promise<void>;
    /**
     * @description 退出全局全屏
     * @returns {Promise<void>}
     */
    exitFullscreen(): Promise<void>;
    /**
     * @description 当前窗口是否全局全屏
     * @readonly
     * @memberof PlayerWindow
     */
    get isCurrentFullscreen(): boolean;
    /**
     * @description 全局全屏状态变化(当前节点)
     * @param event
     */
    private _fullscreenChange;
    private _resize;
    /**
     * @description 监听容器resize
     */
    private _addEventListenerResize;
}

interface WasmDecoderStatue {
    bSupHardOrSoft: boolean;
    bSupHardDecAVC: boolean;
    bSupHardDecHEVC: boolean;
    cmd: 'loaded' | 'onebyone';
    errorCode: number;
    status: any;
}

type Zoom3DCallback = (oRECT?: any) => void;

type SnapshotFmt = 'jpeg';

/**
 * @description 插件管理系统
 */
declare class PluginManager {
    context: EZopenPlayer;
    plugins: Map<string, PlayerPlugin>;
    constructor(player: EZopenPlayer);
    /**
     * @description 注册插件做个插件
     * @param plugins
     */
    usePlugins(plugins: PlayerPlugin[]): Promise<void>;
    /**
     * @description 注册插件
     * @param plugins
     */
    use(plugin: PlayerPlugin): Promise<void>;
    /**
     * @description 通过name销毁指定插件
     * @param {string} name 插件名
     */
    destroyByName(name: string): void;
    /**
     * @description 销毁插件
     */
    destroy(): void;
}

/***
 *  鱼眼矫正
 *
 */
declare class FECCorrect {
    _FECSplitIds: string | undefined;
    _canvasFECSubPort: Map<any, any>;
    _correctType: any;
    private readonly _player;
    constructor(player: EZopenPlayer);
    _supportFEC(): boolean | undefined;
    init(): void;
    /**
     * @description 设置矫正类型
     * @param type
     * @param ids
     * @returns
     */
    setFECCorrectType(type: any, ids?: string): Promise<unknown>;
    /**
     * @description 设置 2D 鱼眼矫正旋转参数
     * @param {number} port 鱼眼端口 主屏默认为 0
     * @param {Object} param2d
     */
    setFEC2DParam(port: number, param2d: any): any;
    /**
     * @description 设置 3D 矫正视角参数
     * @param {FECViewParam} param
     * @returns {Promise<boolean>}  true: 成功  false: 失败  undefined: 不支持
     */
    setFEC3DViewParam(param: any): Promise<boolean>;
    /**
     * @description  获取 3D 矫正视角参数
     * @param {FECGetViewParam} param
     * @returns {Promise<object>}
     */
    get3DViewParam(param: any): Promise<unknown>;
    getFECSubPortMap(): Map<any, any>;
    /**
     * @description 创建分屏画面
     * @returns
     */
    private _createSplitCanvas;
    private _matchUpDateType;
    /**
     * @description 给分屏添加mouse事件
     * @param {string} canvasId
     * @param {{correctType: string}} type
     * @returns
     */
    private _spliceCanvasMouseEvents;
    /**
     * @description 清空所有鱼眼子端口 不包括主窗口
     */
    private _closeFECAllSubWnd;
}

/**
 * 设置水印参数
 */
interface WaterMarkParams {
    /** 文本信息（必填） */
    fontString: string[];
    /** 文本位置 字体的位置，fX 表示横坐标，fY 表示纵坐标，取值范围为[0,1]，左上角是原点。 */
    startPos?: {
        fX: number;
        fY: number;
    };
    /** 字体颜色信息，取值范围 [0,1] (number/255)。其中 fA 表示透明度，0 时完全透明不显示。 */
    fontColor?: {
        fR: number;
        fG: number;
        fB: number;
        fA: number;
    };
    /** 字体大小，字体宽高设置不一样时，显示出来字体大小为宽高中较小值。建议取值 [0~canvasWidth */
    fontSize?: {
        nFontWidth: number;
        nFontHeight: number;
    };
    /** 字体旋转角度 字体旋 转参数，①fRotateAngle 为旋转角度，单位度（0~360 度）。②fFillFullScreen 为 true 表示铺满全屏，会在 canvas 中斜体显示 n 个，false 表示只显示一行。 */
    fontRotate?: {
        fRotateAngle: number;
        fFillFullScreen: boolean;
    };
    /** 字体 */
    fontFamily?: string;
    /** 当平铺斜体水印时，即 FontRotate. fFillFullScreen 为 true 时，需要用到此参数。nRowNumber 表示行数，nColNumber 列数。会显示 4 行 5 列的斜体水印。取值范围[3,13]。 */
    fontNumber?: {
        nRowNumber: number;
        nColNumber: number;
    };
    /** 多行字间距：建议取值范围[1~2]。 */
    space?: number;
    /** @since 8.0.8 */
    pstCanvasAdapt: {
        /** 自适应模式 */
        nCanvasAdaptMode: 0 | 1 | 2;
        nRowSpace: number;
        nColSpace: number;
        nBaseCanvasWidth: number;
        nBaseCanvasHeight: number;
    };
}

/**
 * 7005 断链重连控制器（§5.2 从零新增）。
 *
 * 设计要点：
 * - 纯逻辑 + 依赖注入（now / random / setTimeout / clearTimeout / doReconnect），便于单测；
 * - 单飞保护：用 generation token + inFlight/timer 守卫，同一时刻只允许一个重连流程；
 * - 退避 + 抖动：firstDelay 起，指数退避，封顶 maxDelay，叠加 ±jitter 抖动；
 * - 限额收敛：maxRetry 次数上限 + maxRetryWindow 总时长窗口，超限停止并回调 onExhausted；
 * - 成功复位：onSuccess() 清零计数、取消定时器、递增 generation 使陈旧回调失效；
 * - 分类：致命码（与 A 层 reloadCodeBalckList 对齐）与正常关闭(1000)不重连。
 *
 * 【重要】默认 enabled=false。内核重连必须与 A 层 ezuikit_js 的 `_reload`（备用机房地址重连）
 * 协调后再开启，否则会造成 A 层 + 内核双重重连。开启方式：player._options.streamReconnect.enabled=true。
 */
type ReconnectSource = 'errorCode' | 'socketClose' | 'socketError';
/**
 * `schedule()` 的处置结果，供调用点决定如何向上层上报断链。
 *
 * - `scheduled`：本次断链已被内核接管，已排程退避重连；
 * - `inflight`：已有重连流程在跑，本次被单飞守卫合并（同样属于「内核已接管」）；
 * - `skipped`：内核不接管（未启用 / 致命码 / 1000 正常关闭），上层按原逻辑处理；
 * - `exhausted`：额度已耗尽，`onExhausted` 已在本次调用中同步完成交棒上报，
 *   调用点**不应再重复上报**，否则 A 层会收到两次错误事件。
 */
type ScheduleResult = 'scheduled' | 'inflight' | 'skipped' | 'exhausted';
interface ReconnectTrigger {
    source: ReconnectSource;
    code?: number | string;
    closeInfo?: {
        code?: number;
        reason?: string;
        wasClean?: boolean;
    };
}
interface ReconnectParams {
    /** 是否启用内核重连。默认 false（避免与 A 层 _reload 双重重连） */
    enabled: boolean;
    /** 首次重连等待（ms） */
    firstDelay: number;
    /** 退避因子 */
    backoffFactor: number;
    /** 抖动比例 0..1（±jitter） */
    jitter: number;
    /** 最大重连次数（不含首次播放） */
    maxRetry: number;
    /** 单次最大等待（ms） */
    maxDelay: number;
    /** 重连总时长窗口（ms） */
    maxRetryWindow: number;
    /** 致命错误码：命中不重连 */
    fatalCodes: ReadonlyArray<number | string>;
}
interface ReconnectObservation {
    event: 'scheduled' | 'attemptStart' | 'attemptSuccess' | 'attemptFail' | 'exhausted' | 'skippedFatal' | 'skippedDisabled' | 'skippedInFlight' | 'reset' | 'cancelled';
    generation: number;
    retryCount: number;
    delay?: number;
    reason?: ReconnectTrigger;
    elapsed?: number;
}
interface ReconnectHooks {
    /** 实际执行一次重连（重新取流），成功 resolve，失败 reject */
    doReconnect: (generation: number) => Promise<unknown>;
    logger?: {
        log?: (...args: any[]) => void;
        warn?: (...args: any[]) => void;
        error?: (...args: any[]) => void;
    };
    /** 达重连上限后回调（上层据此上报最终错误） */
    onExhausted?: (lastTrigger: ReconnectTrigger) => void;
    /** 观测埋点回调 */
    onObserve?: (ob: ReconnectObservation) => void;
    now?: () => number;
    random?: () => number;
    setTimeoutFn?: (fn: () => void, ms: number) => any;
    clearTimeoutFn?: (handle: any) => void;
}
declare class ReconnectController {
    private readonly params;
    private readonly hooks;
    private readonly now;
    private readonly random;
    private readonly setTimeoutFn;
    private readonly clearTimeoutFn;
    /** 单飞代际 token：成功/取消时自增，使陈旧回调失效 */
    private _generation;
    /** 当前突发内已重连次数 */
    private _retryCount;
    /** 是否有重连正在执行中 */
    private _inFlight;
    /** 待触发的退避定时器句柄 */
    private _timer;
    /** 当前突发窗口起点时间戳 */
    private _windowStart;
    constructor(params: Partial<ReconnectParams> | undefined, hooks: ReconnectHooks);
    get inFlight(): boolean;
    /**
     * 重连流程是否处于活跃态（**含已排程但尚未触发的退避等待期**）。
     *
     * 与 `inFlight` 的区别：`inFlight` 只在 `doReconnect()` 执行期间为 true，
     * 退避等待那几秒是 false。上层若用 `inFlight` 判断「是否要把断链错误抛给业务方」，
     * 退避等待窗口内会漏判，导致 A 层 `_reload` 抢先切机房、把本次退避重连 cancel 掉。
     * 判定「内核是否已接管本次断链」必须用本 getter。
     */
    get isActive(): boolean;
    get retryCount(): number;
    get generation(): number;
    /** 判断错误码是否致命（不重连） */
    isFatal(code?: number | string): boolean;
    /** 判断该触发是否可恢复（应发起重连） */
    isRecoverable(trigger: ReconnectTrigger): boolean;
    /** 计算第 attempt 次（1-based）重连的退避等待（ms） */
    computeDelay(attempt: number): number;
    /**
     * 收到可恢复断链时调度一次重连（含单飞/限额/退避判定）。
     *
     * 返回处置结果，调用点据此决定是否/如何向上层上报本次断链，避免
     * 「内核正在重连、A 层却同时切机房」与「交棒事件被重复上报」两类问题。
     */
    schedule(trigger: ReconnectTrigger): ScheduleResult;
    private _runAttempt;
    private _exhaust;
    /** 重连成功（收到有效播放/首帧）后复位 */
    onSuccess(): void;
    /** 停止取流/销毁时调用：取消所有重连并复位 */
    cancel(): void;
    private _observe;
}

type MirrorFlipCommand = 0 | 1 | 2;

type StreamInfoCallBackFn = (info: any) => void;

interface EZopenPlayerOptions extends PlayerOptions {
    logger?: LoggerOptions;
    i18n?: any;
    staticPath?: string;
    width?: number;
    height?: number;
    dpr?: number;
    /** 全屏节点 */
    fullScreenEle?: HTMLElement;
    /** 指定解码类型， v1 软解  v3 包括硬解和多线程 */
    decoderType?: 'auto' | 'v1' | 'v3';
    /** 下载当前原始视频流，用于调试，不能动态设置，结束或销毁播放时自动保存成文件并下载 */
    debugDownloadData?: boolean;
    extraParams?: {
        ezopenParams?: Record<string, any>;
        wsParams?: string | Record<string, any>;
    };
    disableRenderPrivateData?: boolean | true;
    decodeEngine?: number | 1;
}
declare class EZopenPlayer implements PlayerInterface {
    _options: EZopenPlayerOptions;
    static EVENT_TYPE: {
        initializing: string;
        loadstart: string;
        abort: string;
        waiting: string;
        canplay: string;
        rateChange: string;
        volumeChange: string;
        debug: string;
        error: string;
        videoInfo: string;
        audioInfo: string;
        decoder: string;
        urlChange: string;
        API: {
            play: string;
            pause: string;
            rateChange: string;
            volumeChange: string;
            destroy: string;
            snapshot: string;
            fullscreen: string;
            exitFullscreen: string;
            resize: string;
            seek: string;
            resume: string;
        };
        NETWORK: {
            deviceCapacity: string;
            deviceInfo: string;
            videoFragmentFiles: string;
            error: {
                error: string;
                deviceCapacity: string;
                deviceInfo: string;
                realPlayUrl: string;
                videoFragmentFiles: string;
            };
        };
        SOCKET: {
            autoClose: string;
            openStream: string;
            startPlay: string;
            stopAll: string;
            setPlayRate: string;
            seek: string;
            close: string;
            error: string;
        };
        CALLBACK: {
            pluginErrorHandler: string;
            getStreamHeaderCallback: string;
            getVideoStreamCallback: string;
            appearFirstFrameCallback: string;
            firstFrameCallback: string;
            averageStreamSuccessCallback: string;
            setRunTimeInfoCallBack: string;
            setAdditionDataCallBack: string;
            openStreamCallback: string;
            stutterDetectedCallback: string;
        };
        FECCorrect: {
            setFEC2DParam: string;
        };
        streamInfoCB: string;
    };
    logger: LoggerCls;
    i18n: I18n;
    event: EventEmitter;
    wasmplayer: typeof JSPlayCtrl;
    initializing: boolean;
    loading: boolean;
    /** 播放速度 */
    playbackRate: number;
    /** 是否在播放中 */
    playing: boolean;
    /** 音量 [0-1] */
    volume: number;
    /** 已经销毁 */
    destroyed: boolean;
    /** 播放地址 query */
    urlInfo: Partial<EzopenURL>;
    /** 设备能力集 */
    deviceCapacity: Partial<DeviceCapacityRes>;
    deviceInfo: Partial<DeviceInfoRes>;
    /** 当前播放出现的错误 */
    error: object | null;
    /** 服务端接口 */
    service: Service;
    $container: HTMLElement;
    esCanvas: ESCanvas;
    fECCorrect: FECCorrect;
    _oStreamClient: StreamClient;
    _aHead: Uint8Array;
    detectTimer: any;
    private _wasmDecoderInfo;
    _g_port: number | null;
    _secretKey: string;
    _tempPauseDate: number | null;
    _tempPauseTime: string;
    _validateCode: string;
    _playbackRate: number;
    /** 视频信息 */
    __videoInfo: any;
    /** 音频信息 */
    __audioInfo: any;
    _waterMarkParams: any;
    _decoderStatus: Partial<WasmDecoderStatue>;
    _wss_info: {
        wssUrl: string;
        oParams: {
            playURL: string;
        };
    };
    /**
     * 7005 断链重连控制器（§5.2）。默认不创建（opt-in）：
     * 仅当 options.streamReconnect.enabled 为真时由 play.ts 惰性创建。
     * 未启用时保持 null，所有调用点用 `?.` 空守卫，行为与原逻辑一致。
     */
    _reconnectController: ReconnectController | null;
    __fCallback: Zoom3DCallback;
    __b3DZoom: boolean;
    pluginManager: PluginManager;
    _playerWindow: PlayerWindow;
    constructor(options: EZopenPlayerOptions);
    private _playerInit;
    /**
     * @description 播放
     * @param options
     * @returns
     */
    play(options?: Partial<Pick<EZopenPlayerOptions, 'url' | 'accessToken'>>): Promise<unknown>;
    _wss_play(szUrl: string, oParams?: {
        playURL: string;
    }, iWndNum?: number): Promise<unknown>;
    /**
     * 暂停播放 并断流???
     * @param {boolean} bool 是否断流
     * @returns
     */
    pause(bool?: boolean): Promise<unknown>;
    /**
     * 恢复
     * @param time
     * @returns
     */
    resume(time: string): Promise<unknown>;
    /**
     * @description 销毁并断流
     * @returns
     */
    destroy(): Promise<void>;
    /**
     * @private
     */
    _destroyed(): void;
    stop(flag?: boolean | number): Promise<unknown>;
    /**
     * @description 截图
     * @param {string} name 文件名 默认时间戳（new Date().getTime()）
     * @param {"jpeg"} fmt 图片格式  只支持 jpeg
     * @param {"base64"} type 文件格式 默认base64
     * @param {boolean} download 是否直接下载 默认不直接下载
     * @param {boolean} canvas 是否使用canvas
     * @returns 返回base64字符
     */
    snapshot(name?: string, fmt?: SnapshotFmt, type?: 'base64', download?: boolean, canvas?: boolean): Promise<IResult<{
        fileName?: string | undefined;
        base64?: string | undefined;
    } | null>>;
    /**
     * @description 全屏
     * @deprecated
     * @param {number} width resize 当前画布的宽 (不存在 需手动resize)
     * @param {number} height resize 当前画布的高 (不存在 需手动resize)
     * @returns
     */
    fullScreen(width?: number, height?: number): Promise<void>;
    /**
     * @description 退出全屏
     * @deprecated
     * @returns
     */
    exitScreen(): Promise<void>;
    /**
     * @description 全屏
     * @param {number} width resize 当前画布的宽 (不存在 需手动resize)
     * @param {number} height resize 当前画布的高 (不存在 需手动resize)
     * @returns {Promise<void>}
     */
    fullscreen(width?: number, height?: number): Promise<void>;
    /**
     * @description 退出全屏
     * @returns {Promise<void>}
     */
    exitFullscreen(): Promise<void>;
    /**
     * @description 当前窗口是否全局全屏
     *
     * @readonly
     * @memberof EZopenPlayer
     */
    get isCurrentFullscreen(): boolean;
    /**
     * 设置画布/视频的尺寸  不设置 默认使用容器的高宽（充满容器）
     * @param {number=} width 画布的宽度
     * @param {number=} height 画布的高度
     * @returns
     */
    resize(width?: number, height?: number): Promise<{
        width: number;
        height: number;
    }>;
    /**
     * 设置音量
     * @param {number} volume 音量[0-1]， 0：表示静音
     * @returns {0 | 1} 1 成功 0 失败
     */
    setVolume(volume: number): number;
    /**
     * @description 插件管理
     * @param plugin 插件
     */
    use(plugin: PlayerPlugin): void;
    /**
     *
     * @param {Object} type 矫正类型  参考 src/ezopen/constants.js
     * @param {string=} ids 如果分屏矫正，需要传入分屏canvas的id字符串列表 如 canvas1,canvas2,canvas3
     * @returns {Array<{code: number, msg: string, port: number, id: string}>} // code= 0 成功， -1 失败
     * @returns
     */
    setFECCorrectType(type: any, ids?: string): Promise<unknown>;
    /**
     * @description 设置 2D 鱼眼矫正旋转参数
     * @param {number} fishSubPort 鱼眼端口 主屏默认为 0
     * @param {Object} param2d
     */
    setFEC2DParam(fishSubPort: number, param2d: object): any;
    /**
     * @description 设置 3D 矫正视角参数
     * @param {object} param
     * @returns {Promise<boolean>}  true: 成功  false: 失败  undefined: 不支持
     */
    setFEC3DViewParam(param: object): Promise<boolean>;
    /**
     * @description  获取 3D 矫正视角参数
     * @param {object} param
     * @returns {Promise<object>}
     */
    get3DViewParam(param: object): Promise<unknown>;
    /**
     * 设置封面
     * @param {string} poster 封面封面地址
     * @returns {void}
     */
    setPoster(poster: string): void;
    /**
     * 设置播放速度 (动态设置倍速画面效果有延时)
     * @param {0.5 | 1 | 2 | 4} rate  2的倍数
     * @returns
     */
    setPlaybackRate(rate: number): void;
    /**
     * @description seek 新的位置 需要设备支持
     * @param {string} startTime 开始时间 YYYYMMDDThhmmssZ
     * @param {string} stopTime 结束时间 YYYYMMDDThhmmssZ
     * @returns {Promise<void>}
     */
    seek(startTime: string, stopTime: string): Promise<void>;
    private _setOptions;
    /**
     * @description 开启3D定位 依赖能力集[ort_zoomOut_maxTime]
     * @param cb
     * @returns
     */
    enable3DZoom(cb: Zoom3DCallback): 0 | -1;
    /**
     * @description 关闭3D定位 依赖能力集[ort_zoomOut_maxTime]
     * @returns
     */
    disable3DZoom(): 0 | -1;
    /**
     * @description 获取当前osd, 当获取失败返回 0
     * @returns {number}
     */
    getOSDTime(): number;
    /**
     * @description 获取帧信息，当获帧接口失败，返回空对象, 软解部分信息没有
     * @returns {IFrameInfo}
     */
    getFrameInfo(): IFrameInfo;
    /**
     * @description 设置播放视频区域 （仅视频不是画布）
     * @param {number} left 视频展示区域 x轴开始位置
     * @param {number} right 视频展示区域 x轴结束位置
     * @param {number} top 视频展示区域 y轴开始位置
     * @param {number} bottom 视频展示区域 y轴结束位置
     * @param {boolean} flag
     * @param {boolean} isFullscreen 当页面旋转 90° 时 需要宽高互换 需要 设置为true
     * @returns {boolean}
     */
    setDisplayRegion(left: number, right: number, top: number, bottom: number, flag?: boolean, isFullscreen?: boolean): boolean;
    /**
     * @description 设置解密密钥 （如果在封装时设置了密钥，那么在播放之前需要调用该接口设置密钥才能正常解码。）
     * @param secretKey 密钥
     * @returns {number} 1 成功  0 失败
     */
    setSecretKey(secretKey: string): void;
    /**
     *
     * @returns
     */
    getOptions(): EZopenPlayerOptions;
    /**
     * @description 切换调试日志等级
     * @param {LoggerOptions} loggerOptions 日志等级
     * @returns {void}
     */
    setLogger(options: LoggerOptions): void;
    /** @since 8.1.9 */
    static version: string;
    /**
     * @description 获取版本号
     * @returns
     */
    getVersion(): {
        version: string;
        decoder: string;
        decoderVersion: any;
    };
    /**
     * @description 设置水印
     * @param {WaterMarkParams} params
     * @returns {Promise<any>}
     */
    setWaterMark(params: WaterMarkParams): Promise<unknown>;
    /**
     * @description 镜像翻转 (需要设备本身支持， 可以重能力集中获取)
     * @link https://open.ys7.com/help/59?h=%E9%95%9C%E5%83%8F%E7%BF%BB%E8%BD%AC#device_ptz-api3
     * @param {0 | 1 | 2} command  0-上下, 1-左右, 2-中心
     *
     * @returns {Promise}
     */
    setMirrorFlip(command: MirrorFlipCommand): Promise<_ezuikit_utils_service_dist_types_fetch.Response<any, undefined>>;
    /**
     * @description 设置流信息回调类型
     * @param {0 | 1} type 回调类型  1 可能只会触发一两次（一般是两次）， 0：才会每帧都触发, 从 0 切到 1 是 不会回调
     * @param { StreamInfoCallBackFn } cb 回调函数
     * @since 8.1.9
     * @returns {void}
     */
    setStreamInfoCallBackType(type: 0 | 1, cb?: StreamInfoCallBackFn): void;
}

export { FECCorrect, PluginManager, StreamClient, EZopenPlayer as default };
export type { EZopenPlayerOptions, IFrameInfo, IResult, IStreamClient, MirrorFlipCommand, PlayerEnv, WasmDecoderStatue, WaterMarkParams };
