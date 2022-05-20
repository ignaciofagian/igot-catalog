import { Request, Response } from 'express';
import * as express from 'express';
import attCtrl from './../controllers/attribute';

const router = express.Router();

/**
 * Get abreviature list
 */
router.get(`/abbreviature/list`, async function getAbbreviatureList(req: Request, res: Response) {
	const abbList = await attCtrl.getAbbreviatureList();
	return res.status(200).json(abbList);
});

/**
 * Get attributes list
 */
 router.get(`/attribute/list`, async function getAttributeList(req: Request, res: Response) {
	const attList = await attCtrl.getAttributeList();
	return res.status(200).json(attList);
});

export default router;
