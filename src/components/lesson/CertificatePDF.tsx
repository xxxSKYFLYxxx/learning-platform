import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

Font.register({
  family: "Inter",
  src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2",
});

const s = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    backgroundColor: "#FAFAF8",
    padding: 0,
  },
  header: {
    backgroundColor: "#1A1A2E",
    padding: 48,
    alignItems: "center",
  },
  badge: {
    fontSize: 8,
    color: "#C9A96E",
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  courseTitle: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    maxWidth: 400,
  },
  body: {
    padding: 48,
    alignItems: "center",
  },
  label: {
    fontSize: 10,
    color: "#6B7280",
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    color: "#1A1A2E",
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 1.6,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: "#C9A96E",
    marginVertical: 24,
  },
  dateRow: {
    alignItems: "center",
    marginTop: 32,
  },
  code: {
    fontSize: 9,
    color: "#9CA3AF",
    fontFamily: "Courier",
    marginTop: 8,
  },
});

interface Props {
  userName: string;
  courseTitle: string;
  issuedAt: Date;
  uniqueCode: string;
}

export function CertificatePDF({ userName, courseTitle, issuedAt, uniqueCode }: Props) {
  const dateStr = new Date(issuedAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Document title={`Сертификат — ${courseTitle}`}>
      <Page size="A4" orientation="landscape" style={s.page}>
        <View style={s.header}>
          <Text style={s.badge}>Сертификат об окончании курса</Text>
          <Text style={s.courseTitle}>{courseTitle}</Text>
        </View>

        <View style={s.body}>
          <Text style={s.label}>Настоящим подтверждается, что</Text>
          <Text style={s.userName}>{userName}</Text>
          <Text style={s.text}>успешно завершил(а) курс</Text>
          <Text style={[s.text, { color: "#1A1A2E", fontWeight: "bold", marginTop: 4 }]}>
            {courseTitle}
          </Text>

          <View style={s.divider} />

          <View style={s.dateRow}>
            <Text style={s.label}>Дата выдачи</Text>
            <Text style={[s.text, { color: "#1F1F1F" }]}>{dateStr}</Text>
            <Text style={s.code}>{uniqueCode}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
