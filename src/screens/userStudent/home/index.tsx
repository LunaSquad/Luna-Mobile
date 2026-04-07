import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  ImageSourcePropType,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import API_BASE_URL from "../../../services/ip";

import styles from "./style/style";

import testPerfil from "../../../assets/assets-home/PerfilTest.png";
import temporyMenu from "../../../assets/assets-home/menu.png";
import LogoLuna from "../../../assets/luna.png";
import seta from "../../../assets/assets-home/seta.png";
import buttonIcon from "../../../assets/assets-home/botaoIcone.png";
import Luna3d from "../../../assets/luna3d.png";

import portuguesImg from "../../../assets/assets-home/portugues.png";
import matematicaImg from "../../../assets/assets-home/matematica.png";
import geografiaImg from "../../../assets/assets-home/geografia.png";

import { MateriaCard } from "../../../components/materiaCard/index";

type RouteParams = {
  userId?: string;
  tipoUser?: string;
};

type HomeProps = {
  route: {
    params?: RouteParams;
  };
};

type Hiperfoco = {
  hiperfocoID?: string;
  nome?: string;
  descricao?: string;
  urlFotoHiperfoco?: string;
};

type Aluno = {
  nome?: string;
  RA?: string;
  turmaID?: string;
  escolaID?: string;
  urlFotoAluno?: string;
  hyperfoco?: Hiperfoco;
  hiperfoco?: Hiperfoco;
};

type MateriaApi = {
  id: string;
  nome: string;
  rota?: string;
};

type MateriaCardData = {
  id: string;
  number: string;
  title: string;
  nome: string;
  image: ImageSourcePropType;
  backgroundColor: string;
  buttonColor: string;
  rota: string;
};

type AlunoResponse = {
  ok: boolean;
  aluno?: Aluno;
  message?: string;
};

type MateriasResponse = {
  ok: boolean;
  materias?: MateriaApi[];
};

type NavigationType = {
  navigate: (
    screen: string,
    params?: {
      materiaId?: string;
      materiaNome?: string;
      userId?: string;
    }
  ) => void;
};

export default function Home({ route }: HomeProps) {
  const navigation = useNavigation<NavigationType>();

  const { userId, tipoUser } = route.params || {};
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [materias, setMaterias] = useState<MateriaCardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  function materiaPreset(nome: string) {
    const n = (nome || "").toLowerCase();

    if (n.includes("port")) {
      return {
        title: "Língua Portuguesa",
        image: portuguesImg as ImageSourcePropType,
        backgroundColor: "#E9F7F6",
        buttonColor: "#0F766E",
      };
    }

    if (n.includes("mat")) {
      return {
        title: "Matemática",
        image: matematicaImg as ImageSourcePropType,
        backgroundColor: "#E6ECFF",
        buttonColor: "#1E3A8A",
      };
    }

    if (n.includes("geo")) {
      return {
        title: "Geografia",
        image: geografiaImg as ImageSourcePropType,
        backgroundColor: "#FFDDD2",
        buttonColor: "#71270F",
      };
    }

    return {
      title: nome,
      image: geografiaImg as ImageSourcePropType,
      backgroundColor: "#EFEFEF",
      buttonColor: "#333",
    };
  }

  function formatNumber(i: number): string {
    const n = String(i + 1).padStart(2, "0");
    return `${n}.`;
  }

  useEffect(() => {
    async function carregarTudo() {
      try {
        console.log("HOME userId:", userId);
        console.log("HOME tipoUser:", tipoUser);

        if (!userId) {
          console.log("❌ Sem userId vindo do login");
          return;
        }

        const respAluno = await fetch(`${API_BASE_URL}/aluno/${userId}`);
        console.log("STATUS ALUNO:", respAluno.status);

        const dataAluno: AlunoResponse = await respAluno.json();
        console.log("DADOS ALUNO:", dataAluno);

        if (!dataAluno.ok) {
          console.log("❌", dataAluno.message);
          return;
        }

        setAluno(dataAluno.aluno || null);

        const escolaID = dataAluno.aluno?.escolaID;
        console.log("ESCOLA ID:", escolaID);

        const hiperfocoNome =
          dataAluno.aluno?.hiperfoco?.nome ||
          dataAluno.aluno?.hyperfoco?.nome ||
          "";

        console.log("HIPERFOCO:", hiperfocoNome);

        if (!escolaID) {
          console.log("❌ aluno sem escolaID");
          return;
        }

        const respMat = await fetch(`${API_BASE_URL}/materias/${escolaID}`);
        console.log("STATUS MATERIAS:", respMat.status);

        const dataMat: MateriasResponse = await respMat.json();
        console.log("MATERIAS:", dataMat);

        if (dataMat.ok) {
          const cards: MateriaCardData[] = (dataMat.materias || []).map(
            (m, idx) => {
              const preset = materiaPreset(m.nome);

              return {
                id: m.id,
                number: formatNumber(idx),
                title: preset.title,
                nome: m.nome,
                image: preset.image,
                backgroundColor: preset.backgroundColor,
                buttonColor: preset.buttonColor,
                rota: m.rota || "Atividades",
              };
            }
          );

          setMaterias(cards);
        }
      } catch (e) {
        console.log("ERRO:", e);
      } finally {
        setLoading(false);
      }
    }

    if (tipoUser === "aluno") {
      carregarTudo();
    } else {
      setLoading(false);
    }
  }, [userId, tipoUser]);

  const hiperfocoNome =
    aluno?.hiperfoco?.nome || aluno?.hyperfoco?.nome || "Não informado";

  const hiperfocoDescricao =
    aluno?.hiperfoco?.descricao ||
    aluno?.hyperfoco?.descricao ||
    "Nenhum hiperfoco cadastrado.";

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.navbar}>
        <Image style={styles.menu} source={temporyMenu} />
        <Image
          style={styles.profilePhoto}
          source={aluno?.urlFotoAluno ? { uri: aluno.urlFotoAluno } : testPerfil}
        />
      </View>

      <View style={styles.body}>
        <View style={styles.spaceLogo}>
          <Image source={LogoLuna} style={styles.logo} />
        </View>

        <View style={styles.spaceNameUsuario}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.nameUsuario}>
              Olá, {aluno?.nome || "Usuário"}
            </Text>
          )}
        </View>

        <View style={styles.spaceHiperfocoAux}>
          <View style={styles.spaceHiperfoco}>
            <Text style={styles.textoHiperfoco}>
              {loading
                ? "Carregando hiperfoco..."
                : `Hiperfoco da criança:\n${hiperfocoNome}`}
            </Text>

            {!loading && (
              <Text style={{ marginTop: 8, fontSize: 12, color: "#444" }}>
                {hiperfocoDescricao}
              </Text>
            )}

            <View style={{ flexDirection: "row" }}>
              <Image source={seta} style={styles.imageSeta} />

              <TouchableOpacity style={styles.bottonHiperfoco}>
                <Image source={buttonIcon} style={{ width: 33, height: 33 }} />
              </TouchableOpacity>

              <Image source={Luna3d} style={styles.luna3d} />
            </View>
          </View>
        </View>

        <View style={styles.spaceMaterias}>
          <View style={styles.spaceTituloMaterias}>
            <Text style={styles.textMaterias}>Matérias</Text>
            <Text style={styles.textVejamais}>Veja mais →</Text>
          </View>

          {loading ? (
            <ActivityIndicator />
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 16 }}
            >
              {materias.map((materia) => (
                <MateriaCard
                  key={materia.id}
                  {...materia}
                  onPress={() =>
                    navigation.navigate("Atividades", {
                      materiaId: materia.id,
                      materiaNome: materia.nome,
                      userId,
                    })
                  }
                />
              ))}
            </ScrollView>
          )}
        </View>

        {!loading && aluno && (
          <View style={{ paddingBottom: 30 }}>
            <Text>RA: {aluno.RA}</Text>
            <Text>Turma: {aluno.turmaID}</Text>
            <Text>Escola: {aluno.escolaID}</Text>
            <Text>
              Hiperfoco: {aluno?.hiperfoco?.nome || aluno?.hyperfoco?.nome}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}