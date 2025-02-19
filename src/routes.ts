import loadable from "@loadable/component";

//公用路由
const routes = [
  {
    path: "/login",
    title: '登录',
    component: loadable(
      () => import(/* webpackChunkName:'login' */ "./pages/login")
    ),
    hidden: true,
    screen: true,
  },
  {
    path: "/",
    redirect: "/scene-manage",
    title: "场景管理",
    hidden: true,
  },
  {
    path: "/security_platform",
    title: "安保可视化",
    // screen: true,
    component: loadable(
      () => import(/* webpackChunkName:'home' */ "./pages/home"),
    ),
  },
  {
    path: "/place_manage",
    title: "场所设施管理",
    component: loadable(
      () =>
        import(/* webpackChunkName:'place_manage' */ "./pages/place-manage"),
    ),
  },
  {
    path: "/site_manage",
    title: "现场管理",
    component: loadable(
      () => import(/* webpackChunkName:'site-manage' */ "./pages/site-manage"),
    ),
  },
  {
    path: "/video_list",
    title: "视频调阅",
    component: loadable(
      () => import(/* webpackChunkName:'video-list' */ "./pages/video-list"),
    ),
  },
  {
    path: "/other",
    title: "其他",
    breadcrumb: null,
    // screen: true, //是否全屏不需要头部和面包屑
    component: loadable(
      () => import(/* webpackChunkName:'other' */ "./pages/undeveloped"),
    ),
  },
  {
    path: "/video_fusion",
    title: "视频融合",
    component: loadable(
      () => import(/* webpackChunkName:'video_fusion' */ "./pages/video-fusion"),
    ),
  },
  {
    path: '/scene-manage',
    backend: true,
    title: "场景管理",
    breadcrumb: {
      data: "场景管理",
    },
    component: loadable(
      () => import(/* webpackChunkName:'scene-manage' */ "./pages/scene-manage"),
    ),
  },
  {
    path: "/activity-manage",
    title: "活动管理",
    backend: true,
    breadcrumb: {
      data: "活动管理",
    },
    component: loadable(
      () =>
        import(
          /* webpackChunkName:'activity-manage' */ "./pages/activity-manage"
        ),
    ),
  },
  {
    path: "/activity-plan-manage",
    title: "活动方案管理",
    backend: true,
    breadcrumb: {
      data: "活动方案管理",
    },
    component: loadable(
      () =>
        import(
          /* webpackChunkName:'activity-plan-manage' */ "./pages/activity-plan-manage"
        ),
    ),
  },
];
export default routes;
