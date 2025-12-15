import * as _ezuikit_utils_service_dist_types_fetch from '@ezuikit/utils-service/dist/types/fetch';
import { LoggerCls } from '@ezuikit/utils-logger/dist/types/logger';
import { LoggerOptions } from '@ezuikit/utils-logger';
import * as I18n from '@ezuikit/utils-i18n';
import I18n__default from '@ezuikit/utils-i18n';
import Service, { DeviceCapacityRes, DeviceInfoRes } from '@ezuikit/utils-service';
import { EzopenURL } from '@ezuikit/utils-tools';
import EventEmitter from 'eventemitter3';
import PlayerRecordPlugin from '@ezuikit/player-plugin-record';

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
interface IResult$1<T> {
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

interface IResult<T> {
    data?: T;
    code?: number;
    msg?: string;
}
/**
 * 播放器标准接口
 */
interface PlayerInterface extends EventEmitter {
    playing: boolean;
    volume: number;
    playbackRate: number;
    deviceCapacity: Record<string, any>;
    i18n: any;
    logger: any;
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
    snapshot: (name?: string, fmt?: 'jpeg', type?: 'base64', download?: boolean) => Promise<IResult<{
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
  resize(width: number, height: number): void;
  canvasRedraw(): void;
  destroy(): void;
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
    container: HTMLElement;
    id: string;
    onCurrentFullScreenChange?: (event: Event) => void;
    dpr?: number;
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
    private _canvasWidth;
    private _canvasHeight;
    dpr: number;
    canvasId: string;
    $canvas: HTMLCanvasElement;
    _options: IPlayerWindowOptions;
    private readonly _$container;
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
    private _removeCanvas;
    /**
     * 重置视频的分辨率
     * @param {number} width 宽度
     * @param {number} height 高度
     */
    resize(width: number, height: number): void;
    /**
     *
     * @param {boolean} remove 是否移除
     * @returns
     */
    reRenderCanvas(remove?: boolean): void;
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
    /** 多行字间距：建议取值范围>1。 */
    space?: number;
    /** 多行字的对齐方式：0 表示居中对齐，1 表示左对齐  @since 8.2.2 */
    fontAlign?: 0 | 1;
    /** @since 8.0.8  8.2.2 开始不支持外部设置 */
    pstCanvasAdapt: {
        /**
         * 自适应模式
         * 0 表示水印行列数/水印大小均不需要随着窗口大小变化而变化。
         * 1 表示字体行列数自适应。即窗口变大，水印字体大小不变，水印行列数变多。
         * 2 表示字体大小自适应。即窗口变大，水印行列数不变，字体变大。
         */
        nCanvasAdaptMode: 0 | 1 | 2;
        /** 行间隔，nCanvasAdaptMode=1 时需要用到。 */
        nRowSpace: number;
        /** 列间隔，nCanvasAdaptMode=1 时需要用到。使用方法规则和 nRowSpace 行间隔一致。 */
        nColSpace: number;
        /** 基准窗口宽，nCanvasAdaptMode=2 时需要用到。
            例: nBaseCanvasWidth=900, pFontParam.pstFontSize.nFontWidth=20
            则字体宽为窗口宽的 20/900。当窗口宽变为 1200 时，字体的宽变
            为 20/900*1200=26。
        */
        nBaseCanvasWidth: number;
        /** 基准窗口高，nCanvasAdaptMode=2 时需要用到。 使用方法和 nBaseCanvasWidth 基准窗口高一致。 */
        nBaseCanvasHeight: number;
    };
}

interface GlobalBaseTimeParams {
    year: number;
    month: number;
    day: number;
    hour: number;
    min: number;
    sec: number;
    ms: number;
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
    container?: HTMLElement;
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
declare class EZopenPlayer extends EventEmitter {
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
        streamInfoCB: string; /** 全屏节点 */
    };
    logger: LoggerCls;
    i18n: I18n__default;
    wasmplayer: typeof JSPlayCtrl;
    /**
     * @deprecated
     * v9.x 中会移除， 请使用 player.on, emit.emit, player.off, player.once, player.removeAllListeners
     */
    event: any;
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
    /** @private */
    _detectTimer: any;
    private _wasmDecoderInfo;
    _width: number;
    _height: number;
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
    __fCallback: Zoom3DCallback;
    __b3DZoom: boolean;
    pluginManager: PluginManager;
    _playerWindow: PlayerWindow;
    constructor(options: EZopenPlayerOptions);
    get width(): number;
    get height(): number;
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
     * @param {boolean} canvas 是否使用 canvas
     * @returns 返回base64字符
     */
    snapshot(name?: string, fmt?: SnapshotFmt, type?: 'base64', download?: boolean, canvas?: boolean): Promise<IResult$1<{
        fileName?: string | undefined;
        base64?: string | undefined;
    } | null>>;
    /**
     * @description 通过canvas截图
     * @param {string} name 文件名 默认时间戳(new Date().getTime())
     * @param {"jpeg"} fmt 图片格式  只支持 jpeg
     * @param {boolean} download 是否直接下载 默认不直接下载 false
     * @returns 返回base64字符
     */
    snapshotByCanvas(name?: string, fmt?: SnapshotFmt, download?: boolean): Promise<IResult$1<{
        fileName?: string | undefined;
        base64?: string | undefined;
    } | null>>;
    /**
     * 重新调整播放器窗口大小
     *
     * Adjust the player window size
     * @param {number | string} width 宽度（number 类型默认px, 支持字符串大小 "100%" | "50vw"）
     * @param {number | string} height 高度（number 类型默认px, 支持字符串大小 "100%" | "50vh"）
     * @since 0.0.1
     * @example
     * ```ts
     * player.resize(600, 400) // 600px * 400px
     * theme.resize("600px", "400px") // 600px * 400px
     * theme.resize("50%", "1vh")
     * theme.resize("2em", "2rem")
     * // 事件监听 event, 这里是具体的宽高（单位px）
     * theme.on(Theme.EVENTS.resize, (width: number, height: number) => {})
     * ```
     * @returns {void}
     */
    resize(width?: number | string, height?: number | string): Promise<{
        width: string | number | undefined;
        height: string | number | undefined;
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
     * @deprecated
     * @param {string} poster 封面封面地址
     * @returns {void}
     */
    setPoster(poster: string): void;
    /**
     * 设置播放速度 (动态设置倍速画面效果有延时)
     * @param {0.5 | 1 | 2 | 4 | 8 | 16 | 32} rate 倍速 需要是2的倍数， 不然不支持
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
    enable3DZoom(cb: Zoom3DCallback): -1 | 0;
    /**
     * @description 关闭3D定位 依赖能力集[ort_zoomOut_maxTime]
     * @returns
     */
    disable3DZoom(): number;
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
     * @description 设置抗锯齿开关
     */
    setAntialias(flag: boolean): any;
    /**
     * @description 设置全局基准时间戳
     * @param {GlobalBaseTimeParams} params
     * @returns {number}
     */
    setGlobalBaseTime(params: GlobalBaseTimeParams): any;
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
    _addEventListener(): void;
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
    openStream(szUrl: string, oParams: object, cbMessage: (msg: object) => void, cbClose: (id?: string) => void, cbError: (id?: string, msg?: any) => void): Promise<string>;
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

declare class JSPlugin {
    constructor(props: any);
    iWidth: any;
    iHeight: any;
    player: EZopenPlayer;
    i18n: I18n.default;
    downloadRecord: any;
    _recordPlugin: PlayerRecordPlugin;
    nWidth: number;
    nHeight: number;
    oStreamClient: StreamClient;
    g_port: number;
    get bPlay(): boolean;
    get iRate(): number;
    set playURL(arg: string);
    get playURL(): string;
    set FECSplitIds(arg: string | undefined);
    get FECSplitIds(): string | undefined;
    set correctType(arg: any);
    get correctType(): any;
    _initEventCallback(): void;
    JSPlayM4_SetDecodeEngine(useHard: any): void;
    useHard: any;
    /**
     *
     * @param {*} szUrl  "示例：wss://jsdecoder-aeye.hwwt2.com:443"
     * @param {*} oParams  "示例： {playURL: "/live?dev=F99467170&chn=9&stream=1&ssn=ot.9oovv27v00lck3ft0krfw61n8ugr4j5b-1ao1cqq1fm-1od8d0d-h1lnhi0w0&auth=1&biz=4&cln=100"}"
     * @param {*} iWndNum
     * @param {*} szStartTime
     * @param {*} szStopTime
     * @returns
     */
    JS_Play(szUrl: any, oParams: any, iWndNum: any, szStartTime: any, szStopTime: any): Promise<unknown>;
    JS_SetSecretKey(iWndNum: any, secretKey: any): void;
    secretKey: any;
    JS_OpenSound(): number;
    JS_CloseSound(): number;
    /**
     * @synopsis 打开3D放大
     *
     * @param {function} fCallback 回调函数
     *
     * @returns {none} 无
     */
    JS_Enable3DZoom(iWin: any, fCallback: Function): none;
    JSPlayM4_SetDisplayRegion(left: any, right: any, top: any, bottom: any): void;
    /**
     * @synopsis 关闭3D放大
     *
     * @returns {none} 无
     */
    JS_Disable3DZoom(): none;
    JS_StartSave(fileName: string | undefined, stopCallback: any, secretKey: any): Promise<void>;
    JS_StopSave(download?: boolean): Promise<unknown>;
    _JSPlayM4_GetFrameInfo(): IFrameInfo;
    _JSPlayM4_SetDisplayRegion(left: any, right: any, top: any, bottom: any, flag: boolean | undefined, isFullScreen: any): boolean;
    JS_CapturePicture(port: any, fileName: any, format: any, callback: any, download: any, canvas: any): Promise<any>;
    JS_GetOSDTime(): Promise<number>;
    JS_Resize(width: any, height: any): void;
    JS_GetSDKVersion(): any;
    JS_Stop(flag: any): Promise<unknown>;
    JS_DestroyWorker(): void;
    JS_Speed(nextRate: any): void;
    JS_Seek(iWndNum: any, szStartTime: any, szStopTime: any): Promise<void>;
    /**
     * @synopsis 暂停
     *
     * @param {number} iWndNum 窗口号
     *
     * @returns {none} 无
     */
    JS_Pause(iWndNum: number, date: any): none;
    /**
     * @synopsis 恢复
     *
     * @param {number} iWndNum 窗口号
     *
     * @returns {none} 无
     */
    JS_Resume(resumeTime: any): none;
    /**
     * @description
     * @param {Object} type 矫正类型  参考 src/ezopen/constants.js
     * @param {string} ids 如果分屏矫正，需要传入分屏canvas的id字符串列表 如 canvas1,canvas2,canvas3
     * @returns {Array<{code: number, msg: string, port: number, id: string}>} // code= 0 成功， -1 失败
     */
    JS_FECCorrectType(type: any, ids: string): Array<{
        code: number;
        msg: string;
        port: number;
        id: string;
    }>;
    /**
     * @description 设置 2D 鱼眼矫正旋转参数
     * @param {number} fishSubPort 鱼眼端口 主屏默认为 0
     * @param {Object} param2d
     */
    JS_FECSetParam2D(fishSubPort: number, param2d: any): any;
    /**
     * @description 设置 3D 矫正视角参数
     * @param {FECViewParam} param
     * @returns {Promise<boolean>}  true: 成功  false: 失败  undefined: 不支持
     */
    FEC_Set3DViewParam(param: FECViewParam): Promise<boolean>;
    /**
     * @description  获取 3D 矫正视角参数
     * @param {FECGetViewParam} param
     * @returns {Promise<object>}
     */
    FEC_Get3DViewParam(param: FECGetViewParam): Promise<object>;
    /**
     * @description 开启水印
     * @param {object} params 开启水印参数
     * fontString：文本信息（必填）
     * startPos：文本位置
     * fontColor：字体颜色
     * fontSize：字体大小
     * fontRotate：字体旋转角度
     * fontFamily：字体
     * @returns {Promise<object>}
     */
    JS_SetWaterMarkFont(params: object): Promise<object>;
    /**
     * @description 设置全局时间戳
     * @param {number} year, month, day, hour, min, sec, ms：年/月/日/时/分/秒/毫秒
     * @returns {code} 0:成功，非0：错误码
     */
    JS_SetGlobalBaseTime(params: any): code;
    /**
     * @description 设置抗锯齿
     * @param {boolean} flag 抗锯齿开关
     * @returns {code} 0:成功，非0：错误码
     */
    JS_SetAntialias(flag: boolean): code;
}

export { JSPlugin as default };
