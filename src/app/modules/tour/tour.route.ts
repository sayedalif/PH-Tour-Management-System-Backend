import express from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';
import { validateRequest } from '../../middlewares/validateRequest';
import { createTourTypeZodSchema, createTourZodSchema } from './tour.validation';
import { TourController } from './tour.controller';

const router = express.Router();

/* ------------------ TOUR TYPE ROUTES -------------------- */
router.post(
    "/create-tour-type",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createTourTypeZodSchema),
    TourController.createTourType
);

/* ---------------- TOUR ROUTES --------------*/
router.post(
  '/create',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTourZodSchema),
  TourController.createTour
);

export const TourRoutes = router;
