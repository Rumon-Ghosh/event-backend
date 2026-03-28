import express from 'express';
// import { AiRoutes } from './ai.route';
import { UserRoutes } from './user.route';
import { EventRoutes } from './event.route';
import { OrderRoute } from './order.route';
import { ReviewRoute } from './review.route';
import { UploadRoute } from './upload.route';
import { AnalyticsRoute } from './analytics.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/events',
    route: EventRoutes,
  },
  {
    path: "/orders",
    route: OrderRoute,
  },
  {
    path: "/reviews",
    route: ReviewRoute,
  },
  {
    path: "/upload",
    route: UploadRoute,
  },
  {
    path: "/analytics",
    route: AnalyticsRoute,
  },
  // {
  //   path: '/ai',
  //   route: AiRoutes,
  // },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;