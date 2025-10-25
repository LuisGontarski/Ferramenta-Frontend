import { useState, useEffect } from "react";
import "./SprintModal.css";
import axios from "axios";
import { toast } from "react-hot-toast";

type Sprint = {
  id: string;
  title: string;
};

type SprintModalProps = {
  onClose: () => void;
  projeto_id: string;
  onSprintCreated: (sprint: { id: string; title: string }) => void;
};

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const SprintModal = ({
  onClose,
  projeto_id,
  onSprintCreated,
}: SprintModalProps) => {
  const [newSprintName, setNewSprintName] = useState("");
  const [storyPoints, setStoryPoints] = useState("");
  const [diasSprint, setDiasSprint] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [diasCalculados, setDiasCalculados] = useState<number>(0);
  const [projetoData, setProjetoData] = useState<{
    data_inicio: string;
    data_fim_prevista: string;
  } | null>(null);

  // Buscar datas do projeto
  useEffect(() => {
    const fetchProjetoData = async () => {
      try {
        const res = await axios.get(`${baseUrl}/projects/${projeto_id}`);
        setProjetoData({
          data_inicio: res.data.data_inicio,
          data_fim_prevista: res.data.data_fim_prevista || res.data.data_fim,
        });
      } catch (err) {
        console.error("Erro ao buscar dados do projeto:", err);
      }
    };

    if (projeto_id) {
      fetchProjetoData();
    }
  }, [projeto_id]);

  // Calcular dias quando datas mudam
  useEffect(() => {
    if (dataInicio && dataFim) {
      const inicio = new Date(dataInicio);
      const fim = new Date(dataFim);

      if (inicio <= fim) {
        const diffTime = Math.abs(fim.getTime() - inicio.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setDiasCalculados(diffDays);
        setDiasSprint(diffDays.toString());
      } else {
        setDiasCalculados(0);
        setDiasSprint("");
      }
    } else {
      setDiasCalculados(0);
    }
  }, [dataInicio, dataFim]);

  // Calcular data final sugerida baseada nos dias
  const calcularDataFinal = (dataInicio: string, dias: number) => {
    if (!dataInicio || !dias) return "";

    const inicio = new Date(dataInicio);
    const fim = new Date(inicio);
    fim.setDate(inicio.getDate() + dias - 1);

    return fim.toISOString().split("T")[0];
  };

  // Quando dias são alterados manualmente
  const handleDiasChange = (dias: string) => {
    setDiasSprint(dias);

    if (dataInicio && dias) {
      const diasNum = parseInt(dias);
      if (diasNum > 0) {
        const novaDataFim = calcularDataFinal(dataInicio, diasNum);
        setDataFim(novaDataFim);
      }
    }
  };

  // Quando data de início é alterada
  const handleDataInicioChange = (novaDataInicio: string) => {
    setDataInicio(novaDataInicio);

    if (diasSprint && novaDataInicio) {
      const diasNum = parseInt(diasSprint);
      if (diasNum > 0) {
        const novaDataFim = calcularDataFinal(novaDataInicio, diasNum);
        setDataFim(novaDataFim);
      }
    }
  };

  const addSprint = async () => {
    const nome_sprint = newSprintName.trim();
    const pontos = storyPoints.trim();
    const dias = diasSprint.trim();

    if (!nome_sprint) {
      toast.error("O nome da sprint é obrigatório");
      return;
    }

    if (!dataInicio || !dataFim) {
      toast.error("Datas de início e fim são obrigatórias");
      return;
    }

    if (diasCalculados <= 0) {
      toast.error("A sprint deve ter pelo menos 1 dia de duração");
      return;
    }

    try {
      const loadingToast = toast.loading("Criando sprint...");

      const res = await axios.post(`${baseUrl}/sprint`, {
        nome: nome_sprint,
        projeto_id: projeto_id,
        story_points: pontos ? parseInt(pontos) : null,
        dias_sprint: dias ? parseInt(dias) : diasCalculados,
        data_inicio: dataInicio,
        data_fim: dataFim,
      });

      const novaSprint: Sprint = {
        id: res.data.sprint_id,
        title: res.data.nome,
      };

      await axios.patch(
        `${baseUrl}/projects/${projeto_id}/sprint-selecionada`,
        {
          sprint_id: novaSprint.id,
        }
      );

      console.log("Sprint criada e definida como selecionada:", novaSprint);

      onSprintCreated(novaSprint);
      localStorage.setItem("sprint_selecionada_id", novaSprint.id);

      setNewSprintName("");
      setStoryPoints("");
      setDiasSprint("");
      setDataInicio("");
      setDataFim("");

      toast.success("Sprint criada e definida como selecionada!", {
        id: loadingToast,
      });

      onClose();
    } catch (err) {
      console.error("Erro ao criar sprint:", err);
      toast.error("Não foi possível criar a sprint.");
    }
  };

  const isFormValid =
    newSprintName.trim() && dataInicio && dataFim && diasCalculados > 0;

  return (
    <div className="sprint-modal-overlay">
      <div className="sprint-modal">
        <div>
          <h2 className="sprint-modal-title">Criar Sprint</h2>
          <h2 className="sprint-modal-description">
            Crie uma nova sprint para poder separar as tarefas
          </h2>
        </div>

        <div className="sprint-modal-inputs">
          <label className="sprint-modal-label">Nome da sprint *</label>
          <input
            className="sprint-modal-input"
            placeholder="Ex: Sprint 1 - Desenvolvimento Inicial"
            type="text"
            value={newSprintName}
            onChange={(e) => setNewSprintName(e.target.value)}
          />

          <div className="sprint-modal-grid">
            <div>
              <label className="sprint-modal-label">Story Points</label>
              <input
                className="sprint-modal-input"
                placeholder="Ex: 40"
                type="number"
                min="0"
                value={storyPoints}
                onChange={(e) => setStoryPoints(e.target.value)}
              />
            </div>

            <div>
              <label className="sprint-modal-label">Dias da Sprint *</label>
              <input
                className="sprint-modal-input"
                placeholder="Ex: 14"
                type="number"
                min="1"
                value={diasSprint}
                onChange={(e) => handleDiasChange(e.target.value)}
              />
              {diasCalculados > 0 && (
                <div className="sprint-modal-days-calculated">
                  {diasCalculados} dia{diasCalculados !== 1 ? "s" : ""}{" "}
                  calculado{diasCalculados !== 1 ? "s" : ""}
                </div>
              )}
            </div>
          </div>

          <div className="sprint-modal-grid">
            <div>
              <label className="sprint-modal-label">Data de Início *</label>
              <input
                type="date"
                className="sprint-modal-input"
                value={dataInicio}
                onChange={(e) => handleDataInicioChange(e.target.value)}
                min={projetoData?.data_inicio?.split("T")[0]}
                max={projetoData?.data_fim_prevista?.split("T")[0]}
              />
            </div>

            <div>
              <label className="sprint-modal-label">Data de Fim *</label>
              <input
                type="date"
                className="sprint-modal-input"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                min={dataInicio || projetoData?.data_inicio?.split("T")[0]}
                max={projetoData?.data_fim_prevista?.split("T")[0]}
              />
            </div>
          </div>

          {/* Informações do projeto */}
          {projetoData && (
            <div className="sprint-modal-project-info">
              <h3 className="sprint-modal-project-title">Período do Projeto</h3>
              <p className="sprint-modal-project-dates">
                {new Date(projetoData.data_inicio).toLocaleDateString("pt-BR")}
                {" a "}
                {new Date(projetoData.data_fim_prevista).toLocaleDateString(
                  "pt-BR"
                )}
              </p>
            </div>
          )}

          {/* Resumo da sprint */}
          {dataInicio && dataFim && (
            <div className="sprint-modal-summary">
              <h3 className="sprint-modal-summary-title">Resumo da Sprint</h3>
              <div className="sprint-modal-summary-details">
                <span>
                  Duração:{" "}
                  <strong>
                    {diasCalculados} dia{diasCalculados !== 1 ? "s" : ""}
                  </strong>
                </span>
                <span>
                  Período:{" "}
                  <strong>
                    {new Date(dataInicio).toLocaleDateString("pt-BR")} a{" "}
                    {new Date(dataFim).toLocaleDateString("pt-BR")}
                  </strong>
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="sprint-modal-actions">
          <button className="sprint-modal-cancel-btn" onClick={onClose}>
            Cancelar
          </button>
          <button
            onClick={addSprint}
            className="sprint-modal-save-btn"
            disabled={!isFormValid}
          >
            Criar Sprint
          </button>
        </div>
      </div>
    </div>
  );
};

export default SprintModal;
