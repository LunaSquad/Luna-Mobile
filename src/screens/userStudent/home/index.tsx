import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  ImageSourcePropType,
  Animated,
  Dimensions,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
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

const { width } = Dimensions.get("window");
const MENU_WIDTH = width * 0.78;

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
  turmaId?: string;
  codTurma?: string;
  idTurma?: string;
  escolaID?: string;
  urlFotoAluno?: string;
  hyperfoco?: Hiperfoco;
  hiperfoco?: Hiperfoco;
};

type MateriaApi = {
  id?: string;
  _id?: string;
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
  detail?: MateriaApi[];
  message?: string;
};

export default function Home({ route }: HomeProps) {
  const navigation = useNavigation<any>();
  const { userId, tipoUser } = route.params || {};

  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [materias, setMaterias] = useState<MateriaCardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [mostrarOpcoesTurma, setMostrarOpcoesTurma] = useState<boolean>(false);

  const [menuAberto, setMenuAberto] = useState(false);
  const slideAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;

  function abrirMenu() {
    setMenuAberto(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }

  function fecharMenu() {
    Animated.timing(slideAnim, {
      toValue: -MENU_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setMenuAberto(false);
    });
  }

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

    if (n.includes("hist")) {
      return {
        title: "História",
        image: geografiaImg as ImageSourcePropType,
        backgroundColor: "#FFF4D6",
        buttonColor: "#92400E",
      };
    }

    if (n.includes("cien") || n.includes("ciên")) {
      return {
        title: "Ciências",
        image: geografiaImg as ImageSourcePropType,
        backgroundColor: "#E7F8EA",
        buttonColor: "#166534",
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

  function transformarMateriasEmCards(listaMaterias: MateriaApi[]) {
    const cards: MateriaCardData[] = listaMaterias.map((m, idx) => {
      const preset = materiaPreset(m.nome);

      return {
        id: m.id || m._id || String(idx),
        number: formatNumber(idx),
        title: preset.title,
        nome: m.nome,
        image: preset.image,
        backgroundColor: preset.backgroundColor,
        buttonColor: preset.buttonColor,
        rota: m.rota || "Atividades",
      };
    });

    setMaterias(cards);
  }

  function sair() {
    fecharMenu();
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    }, 260);
  }

  useEffect(() => {
    async function carregarTudo() {
      try {
        if (!userId) return;

        const respAluno = await fetch(`${API_BASE_URL}/students/aluno/${userId}`);
        const dataAluno: AlunoResponse = await respAluno.json();

        if (!dataAluno.ok) {
          console.log("❌ ERRO ALUNO:", dataAluno.message);
        } else {
          setAluno(dataAluno.aluno || null);
        }

        const respMat = await fetch(`${API_BASE_URL}/subjects/materias`);
        const dataMat: MateriasResponse = await respMat.json();

        if (!dataMat.ok) {
          console.log("❌ ERRO MATERIAS:", dataMat.message);
          return;
        }

        const listaMaterias = dataMat.materias || dataMat.detail || [];
        transformarMateriasEmCards(listaMaterias);

      } catch (e) {
        console.log("ERRO GERAL HOME:", e);
      } finally {
        setLoading(false);
      }
    }

    carregarTudo();
  }, [userId]);

  const hiperfocoNome = aluno?.hiperfoco?.nome || aluno?.hyperfoco?.nome || "Não informado";
  
  // Constante flexível para identificar qualquer formato de turma que esteja no MongoDB
  const codigoTurmaAluno = aluno?.turmaID || aluno?.turmaId || aluno?.codTurma || aluno?.idTurma;

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.container}>
        <StatusBar style="dark" />

        <View style={styles.navbar}>
          <TouchableOpacity onPress={abrirMenu} activeOpacity={0.7}>
            <Image style={styles.menu} source={temporyMenu} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Perfil", { userId })}
          >
            <Image
              style={styles.profilePhoto}
              source={aluno?.urlFotoAluno ? { uri: aluno.urlFotoAluno } : testPerfil}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <View style={styles.spaceLogo}>
            <Image source={LogoLuna} style={styles.logo} />
          </View>

          <View style={styles.spaceNameUsuario}>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.nameUsuario}>Olá, {aluno?.nome || "Usuário"}</Text>
            )}
          </View>

          <View style={styles.spaceHiperfocoAux}>
            <View style={styles.spaceHiperfoco}>
              <View style={styles.hiperfocoContent}>
                <Text style={styles.textoHiperfoco}>
                  {loading ? "Carregando..." : "Indique o hiperfoco\nda criança aqui!"}
                </Text>

                <View style={styles.hiperfocoActionArea}>
                  <Image source={seta} style={styles.imageSeta} />

                  <TouchableOpacity
                    style={styles.bottonHiperfoco}
                    onPress={() =>
                      navigation.navigate("EditHyperfocus", {
                        userId,
                        hiperfocoAtual: hiperfocoNome,
                      })
                    }
                  >
                    <Image source={buttonIcon} style={styles.buttonIconHiperfoco} />
                  </TouchableOpacity>
                </View>
              </View>

              <Image source={Luna3d} style={styles.luna3d} />
            </View>
          </View>

          {loading ? (
             <ActivityIndicator size="large" color="#0F766E" style={{ marginTop: 50 }} />
          ) : !codigoTurmaAluno ? (
            <View style={styles.noClassContainer}>
              <Text style={styles.noClassText}>Você ainda não está em uma turma.</Text>
              
              {!mostrarOpcoesTurma ? (
                <View style={{ alignItems: "center" }}>
                  <TouchableOpacity 
                    style={styles.joinClassButton} 
                    onPress={() => setMostrarOpcoesTurma(true)}
                  >
                    <MaterialIcons name="add" size={40} color="#fff" />
                  </TouchableOpacity>
                  <Text style={styles.joinClassButtonText}>Ingressar em{'\n'}uma turma</Text>
                </View>
              ) : (
                <View style={styles.joinOptionsContainer}>
                  <TouchableOpacity style={styles.joinOptionCard}>
                    <MaterialIcons name="link" size={24} color="#0F766E" />
                    <Text style={styles.joinOptionText}>Inserir Link da Turma</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.joinOptionCard}>
                    <MaterialIcons name="qr-code-scanner" size={24} color="#0F766E" />
                    <Text style={styles.joinOptionText}>Ler QR Code</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.cancelJoinButton} 
                    onPress={() => setMostrarOpcoesTurma(false)}
                  >
                    <Text style={styles.cancelJoinText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.spaceMaterias}>
              <View style={styles.spaceTituloMaterias}>
                <Text style={styles.textMaterias}>Matérias</Text>
                <Text style={styles.textVejamais}>Veja mais →</Text>
              </View>

              {materias.length === 0 ? (
                <Text style={{ marginTop: 16 }}>Nenhuma matéria encontrada.</Text>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingVertical: 16 }}
                >
                  {materias.map((materia) => (
                    <MateriaCard
                      key={materia.id}
                      title={materia.title}
                      image={materia.image}
                      backgroundColor={materia.backgroundColor}
                      buttonColor={materia.buttonColor}
                      number={materia.number}
                      onPress={() =>
                        navigation.navigate("Atividades", {
                          materiaId: materia.id,
                          materiaNome: materia.nome,
                          userId,
                          turmaId: codigoTurmaAluno // <-- O parâmetro vital está aqui agora
                        })
                      }
                    />
                  ))}
                </ScrollView>
              )}
            </View>
          )}

          {!loading && aluno && (
            <View style={{ paddingBottom: 30, paddingTop: 10 }}>
              {codigoTurmaAluno && <Text>Turma: {codigoTurmaAluno}</Text>}
              {aluno.escolaID && <Text>Escola: {aluno.escolaID}</Text>}
            </View>
          )}
        </View>
      </ScrollView>

      {menuAberto && <Pressable style={styles.overlay} onPress={fecharMenu} />}

      <Animated.View
        style={[
          styles.drawer,
          {
            width: MENU_WIDTH,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View>
          <View style={styles.drawerProfile}>
            <Image
              style={styles.drawerPhoto}
              source={aluno?.urlFotoAluno ? { uri: aluno.urlFotoAluno } : testPerfil}
            />
            <View>
              <Text style={styles.drawerName}>{aluno?.nome || "Usuário"}</Text>
              <Text style={styles.drawerSchool}>Luna App</Text>
            </View>
          </View>

          <View style={styles.drawerLine} />

          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => {
              fecharMenu();
              navigation.navigate("EditHyperfocus", {
                userId,
                hiperfocoAtual: hiperfocoNome,
              });
            }}
          >
            <Text style={styles.drawerIcon}>☸</Text>
            <Text style={styles.drawerText}>Editar hiperfoco</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => {
              fecharMenu();
              navigation.navigate("Feedback");
            }}
          >
            <Text style={styles.drawerIcon}>⚭</Text>
            <Text style={styles.drawerText}>Feedback</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => {
              fecharMenu();
              navigation.navigate("ActivitiesProgress", {
                userId,
                materiaNome: "Matemática",
              });
            }}
          >
            <Text style={styles.drawerIcon}>▣</Text>
            <Text style={styles.drawerText}>Atividades concluídas</Text>
          </TouchableOpacity>
        </View>

        <View>
          <View style={styles.drawerLineBottom} />
          <TouchableOpacity style={styles.drawerItem} onPress={sair}>
            <Text style={styles.drawerIcon}>⊙</Text>
            <Text style={styles.drawerText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}