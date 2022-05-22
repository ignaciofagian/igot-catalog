class AttributeController {
	public getAbbreviatureList() {
		return [
			{ id: 1, name: 'Fecha', abbreviature: 'Fch', description: 'Fecha' },
			{ id: 2, name: 'Proyecto', abbreviature: 'Proy', description: 'Proyecto' },
			{ id: 3, name: 'Programa', abbreviature: 'Prog', description: 'Programa' },
			{ id: 4, name: 'Año', abbreviature: 'Ano', description: 'Año' },
      { id: 1, name: 'Fecha', abbreviature: 'Fch', description: 'Fecha' },
			{ id: 2, name: 'Proyecto', abbreviature: 'Proy', description: 'Proyecto' },
			{ id: 3, name: 'Programa', abbreviature: 'Prog', description: 'Programa' },
			{ id: 4, name: 'Año', abbreviature: 'Ano', description: 'Año' },
      { id: 1, name: 'Fecha', abbreviature: 'Fch', description: 'Fecha' },
			{ id: 2, name: 'Proyecto', abbreviature: 'Proy', description: 'Proyecto' },
			{ id: 3, name: 'Programa', abbreviature: 'Prog', description: 'Programa' },
			{ id: 4, name: 'Año', abbreviature: 'Ano', description: 'Año' },
		];
	}

	public getAttributeList() {
		return [
			{ id: 1, name: 'Alcance espacial', attribute: 'AlcEsp', description: 'Alcance espacial' },
			{ id: 2, name: 'Ambito aplicación', attribute: 'AmbApl', description: 'Ambito aplicación' },
			{ id: 3, name: 'Año construcción', attribute: 'AnoCons', description: 'Año construcción' },
			{ id: 4, name: 'Año conformación', attribute: 'AnoConf', description: 'Año conformación' },
			{
				id: 5,
				name: 'Cantidad de dormitorios',
				attribute: 'CantDor',
				description: 'Cantidad de dormitorios',
			},
			{ id: 6, name: 'Cantidad viviendas', attribute: 'CantViv', description: 'Cantidad viviendas' },
			{ id: 7, name: 'Categoría del suelo', attribute: 'CatSue', description: 'Categoría del suelo' },
			{
				id: 8,
				name: 'Clase cobertura de área impermeable urbana',
				attribute: 'CobImpUrb',
				description: 'Cobertura impermeable urbana',
			},
			{
				id: 9,
				name: 'Clase cobertura de la Tierra',
				attribute: 'CobTie',
				description: 'cobertura Tierra',
			},
			{
				id: 10,
				name: 'Código conjunto habitacional',
				attribute: 'CodHab',
				description: 'Código habitacional',
			},
			{ id: 11, name: 'Departamento', attribute: 'Depto', description: 'Departamento' },
			{ id: 12, name: 'Direccion', attribute: 'Direccion', description: 'Direccion' },
			{ id: 13, name: 'Documento Normativo', attribute: 'DocNor', description: 'Documento Normativo' },
			{
				id: 14,
				name: 'Estado Proyecto Constructivo',
				attribute: 'EstProyCon',
				description: 'Estado de avance del proyecto constructivo',
			},
			{ id: 15, name: 'Estado terreno', attribute: 'EstTerr', description: 'Estado terreno' },
			{
				id: 16,
				name: 'Etapa IOT elaboración',
				attribute: 'EtaIOTElab',
				description: 'Etapa de los instrumentos de ordenamiento territorial en elaboración',
			},
			{
				id: 17,
				name: 'Etiqueta cobertura',
				attribute: 'EtqCob',
				description: 'Etiqueta clase de cobertura de la Tierra',
			},
			{
				id: 18,
				name: 'Etiqueta subclase cobertura',
				attribute: 'EtqSubCob',
				description: 'Etiqueta subclase de cobertura de la Tierra',
			},
			{ id: 19, name: 'Fecha censo', attribute: 'FchCens', description: 'Fecha del censo' },
		];
	}
}

export default new AttributeController();
