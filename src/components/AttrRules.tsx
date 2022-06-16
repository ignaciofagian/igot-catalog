import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { List, Card, CardTitle, Button } from "reactstrap";
import { Abbreviature, getAbbreviatureList } from "../services/api";
import { store } from "../utils/attrCalculator";
import AttrDictionary, { AbbrevEdit } from "./AttrDictionary";
import { IEditModal } from "./AttrEdit";
import style from "./AttrRules.module.scss";
export default function AttrRules({ serverReload, abbreviatures }: any) {
  const [editModal, setEditModal] = useState<IEditModal>({ open: false });

  useEffect(() => {
    serverReload("abbreviatures");
  }, []);

  useEffect(() => {
    store.abbreviatures = abbreviatures;
  }, [abbreviatures]);

  const handleToggleEdit = (event?: any) => {
    const id = +event?.currentTarget.getAttribute("data-id");
    if (id) {
      const abbrev = abbreviatures?.find((abb: Abbreviature) => abb.id === id);
      setEditModal({ open: true, data: abbrev });
    } else {
      serverReload("all");
      setEditModal({ open: !editModal.open });
    }
  };

  return (
    <Card body>
      <CardTitle tag="h5">
        <div className="d-flex">
          <div className="flex-grow-1">Reglas de codificacion </div>
          <Button outline size="sm" color="primary" onClick={handleToggleEdit}>
            <FontAwesomeIcon icon={faPlus} className="me-1" />
            Agregar nueva
          </Button>
        </div>
      </CardTitle>
      <List type="disc" className={style.abbrList}>
        <li>
          Eliminar de los conceptos artículos, contracciones y preposiciones*.
        </li>
        <li>
          (1) Cuando el concepto tiene una palabra y termina en ese, poner las 4
          primeras letras de la palabra y agregar ese al final.
        </li>
        <li>
          (2) Cuando el concepto tiene 2 palabras que terminan en ese, poner las 4
          primeras letras de la primera palabra, las 4 primeras letras de la
          segunda y agregar ese al final.
        </li>
        <li>
          (3) Cuando el concepto tiene 1 o 2 palabras se utiliza el truncamiento con
          las primeras 4 letras por palabra.
        </li>
        <li>
          (4) Cuando el concepto tiene 3 palabras hasta 10, utilizar el criterio de
          truncamiento para las fórmulas fijas, esto es, se toma la inicial de
          cada palabra.
        </li>
      </List>
      <div className="mb-1" />
      <AttrDictionary
        abbreviatures={abbreviatures}
        toggleEdit={handleToggleEdit}
        serverReload={serverReload}
      />
      <AbbrevEdit toggle={handleToggleEdit} {...editModal} />
    </Card>
  );
}
