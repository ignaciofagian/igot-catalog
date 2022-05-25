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
 * Post add abreviature
 */
router.post(`/abbreviature/add`, async function postAbbreviatureAdd(req: Request, res: Response) {
	const abbrev = req.body;
	const result = await attCtrl.addAbbreviature(abbrev);
	return res.status(200).json(result);
});

/**
 * Post edit abreviature
 */
router.post(`/abbreviature/edit`, async function postAbbreviatureEdit(req: Request, res: Response) {
	const abbrev = req.body;
	const result = await attCtrl.editAbbreviature(abbrev);
	return res.status(200).json(result);
});

/**
 * Post delete abreviature
 */
router.post(
	`/abbreviature/delete`,
	async function postAbbreviatureDelete(req: Request, res: Response) {
		const abbrevId = req.body.id;
		const result = await attCtrl.deleteAbbreviature(abbrevId);
		return res.status(200).json(result);
	},
);

/**
 * Get attributes list
 */
router.get(`/attribute/list`, async function getAttributeList(req: Request, res: Response) {
	const attList = await attCtrl.getAttributeList();
	return res.status(200).json(attList);
});

/**
 * Post add attribute
 */
router.post(`/attribute/add`, async function postAttributeAdd(req: Request, res: Response) {
	const attr = req.body;
	const result = await attCtrl.addAttribute(attr);
	return res.status(200).json(result);
});

/**
 * Post edit attribute
 */
router.post(`/attribute/edit`, async function postAttributeEdit(req: Request, res: Response) {
	const attr = req.body;
	const result = await attCtrl.editAttribute(attr);
	return res.status(200).json(result);
});

/**
 * Post delete attribute
 */
router.post(`/attribute/delete`, async function postAttributeDelete(req: Request, res: Response) {
	const attrId = req.body.id;
	const result = await attCtrl.deleteAttribute(attrId);
	return res.status(200).json(result);
});

export default router;
