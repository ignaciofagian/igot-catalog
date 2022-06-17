import { useState } from "react";
import { Button, Card, Input, Row, Col, Container, Alert } from "reactstrap";
import Autosuggest from "react-autosuggest";
import style from "./AttrSuggest.module.scss";
import {
  AttrParts,
  AttrResult,
  calculate,
  checkDuplicates,
} from "../utils/attrCalculator";
import classnames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faWarning } from "@fortawesome/free-solid-svg-icons";

const theme = {
  suggestionsContainer: style.suggestionsContainer,
  suggestionsContainerOpen: style.suggestionsContainerOpen,
  suggestionsList: style.suggestionsList,
  suggestionHighlighted: style.suggestionHighlighted,
  suggestion: style.suggestion,
  input: style.input,
};

export default function AttrSuggest({
  value,
  onChange,
  toggleTable,
  toggleEdit,
}: any) {
  const [alert, setAlert] = useState<any>(null!);
  const [suggestions, setSuggestions] = useState<any>([]);
  const [result, setResult] = useState<AttrResult | null>(null);

  const onSuggestionsFetchRequested = (): any => {
    setSuggestions([]);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelected = (value: any) => {};

  const getSuggestionValue = (suggestion: any) => {
    return `${suggestion.id} ${suggestion.name}`;
  };

  const renderSuggestion = (suggestion: any, { query }: any) => {
    return (
      <div>
        `${suggestion.id} ${suggestion.name}`
      </div>
    );
  };

  const onChangeInput = (event: any, { newValue, method }: any) => {
    onChange(newValue);
    if (newValue?.length > 1) {
      const attrResult = calculate(newValue);
      setTimeout(() => {
        if (value !== "") {
          if (result?.status == 200) {
            const duplicated = checkDuplicates(attrResult?.attribute);
            if (duplicated) {
              setAlert(
                `Attr. duplicado: ${duplicated.attribute} (${duplicated.name})`
              );
            } else setAlert(null);
          }
          setResult(attrResult);
          toggleTable(true);
        }
      }, 50);
    } else {
      setAlert(null!);
      setResult(null);
      toggleTable(false);
    }
  };

  const handleClear = () => {
    setAlert(null!);
    setResult(null);
    toggleTable(false);
    onChange("");
  };

  return (
    <div>
      <div className="d-flex">
        <Autosuggest
          theme={theme}
          containerProps={{ className: "flex-grow-1 me-3" }}
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          onSuggestionSelected={onSuggestionSelected}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          renderInputComponent={(inputProps) => (
            // @ts-ignore
            <Input {...inputProps} />
          )}
          inputProps={{ value, onChange: onChangeInput }}
        />
        <Button
          onClick={handleClear}
          disabled={value.length === 0}
          color="light"
        >
          Limpiar
        </Button>
        <Button
          onClick={(e: any) => toggleEdit(e, value)}
          outline
          size="sm"
          color="primary"
          className="ms-4"
        >
          <FontAwesomeIcon icon={faPlus} className="me-1" />
          Agregar nuevo
        </Button>
      </div>
      {result != null && result.status == 200 && (
        <SuggestResult value={result} alert={alert} />
      )}
      {result != null && result.status == 400 && (
        <Alert color="danger" className="mt-2">
          {result?.errors?.map((e: string) => (
            <div>{e}</div>
          ))}
        </Alert>
      )}
    </div>
  );
}

export function SuggestResult({ value, alert }: any) {
  return (
    <Card body className={classnames("mt-2 p-2")}>
      <Row>
        <Col lg="9">
          <div className={style.result}>
            <div className={style.attr}>
              {value.attribute}
              {alert && (
                <span className={style.alert}>
                  <FontAwesomeIcon icon={faWarning} /> {alert}
                </span>
              )}
            </div>
            <div className={style.explain}>
              <div>
                {value?.parts
                  ?.filter((e: AttrParts) => e.wordType != "StopWord")
                  .map((e: AttrParts) => e.original)
                  .join(" ")}
              </div>
              <div>{"->"}</div>
              <div>
                {value?.parts?.map((e: AttrParts) => (
                  <>
                    {e.wordType === "StopWord" && (
                      <span className={style.stopWord}>{e.original}</span>
                    )}
                    {e.wordType === "Abbreviation" && (
                      <span className={style.abbrev}>{e.current}</span>
                    )}
                    {e.wordType === "Default" && (
                      <span className={style.normal}>{e.current}</span>
                    )}
                  </>
                ))}
              </div>
              <div>{"->"}</div>
              <div>{value?.attribute}</div>
            </div>
          </div>
        </Col>
        <Col lg="3" style={{ borderLeft: "solid 1px lightgray" }}>
          <div>Cantidad de letras: {value.attribute?.length}</div>
        </Col>
      </Row>
    </Card>
  );
}
