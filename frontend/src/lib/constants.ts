export const reportCategories = [
  { value: "IluminacaoPublica", label: "Iluminação Pública" },
  { value: "PavimentacaoBuracos", label: "Pavimentação e Buracos" },
  { value: "SaneamentoEsgoto", label: "Saneamento e Esgoto" },
  { value: "SegurancaOrdem", label: "Segurança e Ordem Pública" },
  { value: "LimpezaLixo", label: "Limpeza Urbana e Lixo" },
  { value: "TransitoSinalizacao", label: "Trânsito e Sinalização" },

  { value: "ArvoresVegetacao", label: "Árvores e Vegetação" }, 
  { value: "CalcadasAcessibilidade", label: "Calçadas e Acessibilidade" }, 
  { value: "ControlePragas", label: "Controle de Pragas" },
  { value: "EquipamentosPublicos", label: "Equipamentos Públicos Danificados" }, 
  { value: "PoluicaoSonora", label: "Poluição Sonora" }, 
  { value: "TransportePublico", label: "Transporte Público" }, 
  { value: "VazamentoAgua", label: "Vazamento de Água" }, 
  { value: "VeiculosAbandonados", label: "Veículos Abandonados" }, 

  { value: "Outros", label: "Outros Problemas" },
];

export const categoryValues = reportCategories.map((c) => c.value);
