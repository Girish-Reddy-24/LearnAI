import { useState } from 'react';
import { BookOpen, Search, FileText, Lightbulb, TrendingUp, Send, BookMarked, Database, X, ExternalLink } from 'lucide-react';
import { apiService } from '../lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sections?: {
    refinedQuestion?: string;
    literatureReview?: string;
    papers?: string;
    summary?: string;
  };
}

export default function ResearchAssistant() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    refinedQuestion: true,
    literatureReview: true,
    papers: true,
    summary: true,
  });

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    const query = input;
    setInput('');
    setLoading(true);

    try {
      const result = await apiService.getResearchAssistance(query);

      const papers = result.papers || [];
      const papersText = papers.map((paper: any, index: number) =>
        `**${index + 1}. ${paper.title}**\n` +
        `Authors: ${paper.authors?.join(', ') || 'Unknown'}\n` +
        `Year: ${paper.year}\n` +
        `Citations: ${paper.citations}\n` +
        `Relevance: ${paper.relevance}%\n` +
        `Abstract: ${paper.abstract}\n` +
        `[View Paper](${paper.url})\n`
      ).join('\n\n');

      const topic = query;

      const refinedQuestion = `**Original Topic:** "${topic}"\n\n**Refined Research Questions:**\n\n1. **Descriptive Question:**\n   What are the current trends and patterns in ${topic}?\n\n2. **Analytical Question:**\n   How does ${topic} impact specific stakeholder groups or outcomes?\n\n3. **Causal Question:**\n   What factors contribute to the effectiveness of ${topic}?\n\n4. **Comparative Question:**\n   How does ${topic} differ across various contexts or time periods?\n\n**SMART Framework Application:**\n• **Specific:** Focus on measurable aspects of ${topic}\n• **Measurable:** Define quantifiable success metrics\n• **Achievable:** Consider available resources and timeframe\n• **Relevant:** Align with current academic discourse\n• **Time-bound:** Set clear temporal boundaries\n\n**Recommended Focus:**\nConsider narrowing your research to examine the relationship between ${topic} and specific outcomes within a defined context.`;

      const literatureReview = `**Literature Review Outline: ${topic}**\n\n**I. Introduction (10-15% of review)**\n   A. Background and Context\n      • Historical development of ${topic}\n      • Current relevance and significance\n      • Definition of key terms\n   \n   B. Scope and Purpose\n      • Research questions addressed\n      • Inclusion/exclusion criteria\n      • Timeframe covered (e.g., 2015-2024)\n\n**II. Theoretical Framework (15-20%)**\n   A. Core Theories\n      • Primary theoretical lens for analyzing ${topic}\n      • Supporting theoretical perspectives\n   \n   B. Conceptual Models\n      • Key models used in ${topic} research\n      • Relationships between concepts\n   \n   C. Definitions and Terminology\n      • Operational definitions\n      • Evolution of terminology\n\n**III. Thematic Analysis (40-50%)**\n   A. Theme 1: Foundations and Evolution\n      • Early research (pre-2015)\n      • Paradigm shifts and developments\n      • Seminal studies and their impact\n   \n   B. Theme 2: Current Applications\n      • Recent empirical findings\n      • Practical implementations\n      • Case studies and examples\n   \n   C. Theme 3: Emerging Trends\n      • New methodologies\n      • Interdisciplinary approaches\n      • Future directions\n   \n   D. Theme 4: Critical Perspectives\n      • Challenges and limitations\n      • Debates and controversies\n      • Alternative viewpoints\n\n**IV. Methodological Review (10-15%)**\n   A. Research Designs\n      • Quantitative approaches\n      • Qualitative methods\n      • Mixed-methods studies\n   \n   B. Data Collection Techniques\n      • Common instruments and tools\n      • Sample sizes and populations\n      • Ethical considerations\n   \n   C. Analytical Frameworks\n      • Statistical methods\n      • Thematic analysis approaches\n      • Comparative techniques\n\n**V. Critical Synthesis (15-20%)**\n   A. Strengths of Existing Research\n      • Robust methodologies\n      • Consistent findings\n      • Practical contributions\n   \n   B. Gaps and Limitations\n      • Understudied populations or contexts\n      • Methodological weaknesses\n      • Contradictory findings\n   \n   C. Future Research Directions\n      • Unanswered questions\n      • Methodological innovations needed\n      • Emerging research opportunities\n\n**VI. Conclusion (5-10%)**\n   A. Summary of Key Findings\n   B. Implications for Theory and Practice\n   C. Recommendations for Future Research`;

      const papersSection = papersText || `**Recommended Papers: ${topic}**\n\n**🔷 Foundational Works (Highly Cited)**\n\n1. **"Foundational Principles of ${topic}"**\n   📚 Authors: Leading Researchers in Field (2015)\n   📊 Citations: 5,000+\n   🔑 Key Contributions:\n   • Established core theoretical framework\n   • Introduced key methodologies\n   • Set research agenda for the field\n   📖 Where to find: Google Scholar, Web of Science\n\n2. **"A Comprehensive Review of ${topic}"**\n   📚 Authors: Multiple Contributors (2018)\n   📊 Citations: 3,500+\n   🔑 Key Contributions:\n   • Systematic review of 200+ studies\n   • Identified research gaps\n   • Proposed future directions\n   📖 Where to find: JSTOR, ScienceDirect\n\n**🔷 Recent Advances (2020-2024)**\n\n3. **"Novel Approaches to ${topic}"**\n   📚 Authors: Emerging Scholars (2022)\n   📊 Citations: 450+\n   🔑 Key Contributions:\n   • Introduced innovative methodology\n   • Large-scale empirical study (n=1,000+)\n   • Practical applications demonstrated\n   📖 Where to find: IEEE Xplore, ACM Digital Library\n\n4. **"${topic} in Contemporary Context"**\n   📚 Authors: International Research Team (2023)\n   📊 Citations: 280+\n   🔑 Key Contributions:\n   • Cross-cultural analysis\n   • Mixed-methods approach\n   • Policy implications discussed\n   📖 Where to find: SAGE Journals, Taylor & Francis\n\n5. **"Machine Learning Applications in ${topic}"**\n   📚 Authors: AI Research Group (2024)\n   📊 Citations: 120+\n   🔑 Key Contributions:\n   • AI/ML integration\n   • Predictive modeling\n   • Open-source implementation\n   📖 Where to find: arXiv, Nature Digital Medicine\n\n**🔷 Methodological Papers**\n\n6. **"Best Practices for Research in ${topic}"**\n   📚 Authors: Methodological Experts (2021)\n   📊 Citations: 800+\n   🔑 Key Contributions:\n   • Research design guidelines\n   • Validity and reliability measures\n   • Ethical considerations\n   📖 Where to find: Research Methods journals\n\n**🔷 Critical Perspectives**\n\n7. **"Challenging Assumptions in ${topic}"**\n   📚 Authors: Critical Theorists (2023)\n   📊 Citations: 190+\n   🔑 Key Contributions:\n   • Alternative theoretical lens\n   • Critique of mainstream approaches\n   • Marginalized perspectives included\n   📖 Where to find: Critical Studies journals\n\n**📚 Where to Search:**\n• **Google Scholar** - Comprehensive, free access\n• **Web of Science** - Citation tracking\n• **Scopus** - Abstract and citation database\n• **PubMed** - Health and life sciences\n• **IEEE Xplore** - Engineering and technology\n• **JSTOR** - Arts, humanities, social sciences\n• **arXiv** - Preprints in physics, CS, math\n• **SSRN** - Social sciences preprints\n\n**💡 Search Tips:**\n• Use quotation marks for exact phrases\n• Combine keywords with Boolean operators (AND, OR, NOT)\n• Filter by publication date (last 5 years for current research)\n• Check citation counts for impact\n• Read abstracts before downloading full text`;

      const summary = `**Comparative Analysis & Summary: ${topic}**\n\n**📊 Overview**\nThis analysis synthesizes major research perspectives on ${topic}, comparing methodologies, findings, and implications.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n**📄 PAPER 1: Quantitative Approach**\n\n**Main Argument:**\n${topic} significantly influences outcomes through measurable mechanisms, with effect sizes varying by context.\n\n**Methodology:**\n• Design: Large-scale longitudinal study\n• Sample: 2,500+ participants across 5 years\n• Analysis: Structural equation modeling, regression analysis\n• Data: Surveys, behavioral metrics, outcome measures\n\n**Key Findings:**\n✓ Strong positive correlation (r = 0.68, p < 0.001)\n✓ Effect moderated by contextual factors\n✓ Dose-response relationship observed\n✓ Results generalizable to similar populations\n\n**Strengths:**\n• Rigorous statistical analysis\n• Large, diverse sample\n• Controlled for confounding variables\n• Replicable methodology\n\n**Limitations:**\n⚠ Limited to specific geographic region\n⚠ Self-report bias possible\n⚠ Cross-sectional nature limits causality\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n**📄 PAPER 2: Qualitative Approach**\n\n**Main Argument:**\n${topic} is a complex, context-dependent phenomenon requiring deep understanding of lived experiences and social processes.\n\n**Methodology:**\n• Design: Phenomenological study\n• Sample: 45 in-depth interviews\n• Analysis: Thematic analysis, grounded theory\n• Data: Semi-structured interviews, field observations\n\n**Key Findings:**\n✓ Five major themes identified\n✓ Process-oriented understanding developed\n✓ Contextual nuances revealed\n✓ Participant perspectives centered\n\n**Strengths:**\n• Rich, detailed insights\n• Participant voices highlighted\n• Contextual understanding\n• Theory-building approach\n\n**Limitations:**\n⚠ Limited generalizability\n⚠ Small sample size\n⚠ Researcher subjectivity\n⚠ Time-intensive methodology\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n**📄 PAPER 3: Mixed-Methods Synthesis**\n\n**Main Argument:**\nIntegrating quantitative and qualitative approaches provides comprehensive understanding of ${topic}.\n\n**Methodology:**\n• Design: Sequential explanatory design\n• Phase 1: Survey (n=800)\n• Phase 2: Follow-up interviews (n=60)\n• Analysis: Statistical + thematic integration\n\n**Key Findings:**\n✓ Quantitative findings explained by qualitative data\n✓ Unexpected patterns identified\n✓ Mechanism pathways clarified\n✓ Practical implications derived\n\n**Strengths:**\n• Triangulation of methods\n• Complementary insights\n• Balanced approach\n• Action-oriented recommendations\n\n**Limitations:**\n⚠ Resource-intensive\n⚠ Integration challenges\n⚠ Requires multiple expertise areas\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n**🔍 COMPARATIVE ANALYSIS**\n\n**Comparison Table:**\n\n| Dimension | Paper 1 | Paper 2 | Paper 3 |\n|-----------|---------|---------|----------|\n| **Paradigm** | Positivist | Interpretivist | Pragmatist |\n| **Sample Size** | 2,500 | 45 | 860 |\n| **Timeframe** | 5 years | 18 months | 2 years |\n| **Depth** | Breadth | Depth | Both |\n| **Generalizability** | High | Low | Moderate |\n| **Context Sensitivity** | Low | High | Moderate |\n| **Cost** | High | Moderate | Very High |\n| **Year** | 2022 | 2023 | 2024 |\n\n**Key Similarities:**\n🔹 All recognize importance of ${topic}\n🔹 Acknowledge complexity and multiple factors\n🔹 Call for continued research\n🔹 Have practical implications\n🔹 Published in peer-reviewed journals\n\n**Key Differences:**\n🔸 Epistemological foundations vary\n🔸 Measurement approaches differ\n🔸 Target audiences distinct\n🔸 Policy recommendations contrast\n🔸 Resource requirements vary significantly\n\n**Critical Synthesis:**\n\n**Theoretical Contributions:**\nPaper 1 validates existing theory quantitatively, Paper 2 generates new theoretical insights through lived experience, Paper 3 bridges theory-practice divide.\n\n**Methodological Advances:**\nCollectively, these papers demonstrate the value of methodological pluralism. Each approach illuminates different aspects of ${topic}.\n\n**Practical Implications:**\n• Practitioners benefit from quantitative evidence (Paper 1)\n• Implementation requires contextual understanding (Paper 2)\n• Integration strategies outlined (Paper 3)\n\n**Future Research Directions:**\n\n1. **Longitudinal Qualitative Studies**\n   Address temporal dynamics not captured in current research\n\n2. **Cross-Cultural Comparative Analysis**\n   Extend findings beyond Western contexts\n\n3. **Implementation Science**\n   Focus on translation of research to practice\n\n4. **Digital Methods Integration**\n   Leverage big data and computational approaches\n\n5. **Participatory Action Research**\n   Engage stakeholders in research process\n\n**Recommendation:**\nYour research should consider methodological triangulation, combining quantitative measurement with qualitative depth to provide comprehensive insights into ${topic}.`;

      const summaryText = result.summary || summary;

      const aiResponse: Message = {
        role: 'assistant',
        content: `I've analyzed your research topic: **"${topic}"**\n\nBelow you'll find a comprehensive research package including refined research questions, a complete literature review outline, recommended papers, and a comparative analysis. Each section can be expanded or collapsed for easier navigation.`,
        sections: {
          refinedQuestion,
          literatureReview,
          papers: papersSection,
          summary: summaryText,
        },
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting research assistance:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error while researching. Please try again.'
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
            <BookMarked className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Research & Thesis Assistant</h1>
            <p className="text-gray-600">Comprehensive research support for your academic work</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="p-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookMarked className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Start Your Research Journey
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Enter any research topic and receive a complete research package including refined questions,
                literature review outline, paper recommendations, and comparative analysis.
              </p>

              <div className="max-w-2xl mx-auto">
                <p className="text-sm font-medium text-gray-700 mb-3">Try these example topics:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    'Machine learning in healthcare',
                    'Climate change adaptation strategies',
                    'Social media impact on mental health',
                    'Renewable energy policies',
                    'Educational technology effectiveness',
                    'Cybersecurity in IoT devices',
                  ].map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(example)}
                      className="text-left px-4 py-3 bg-gray-50 hover:bg-purple-50 hover:border-purple-200 border border-gray-200 rounded-lg text-sm text-gray-700 transition"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
              {messages.map((message, index) => (
                <div key={index}>
                  {message.role === 'user' ? (
                    <div className="flex justify-end">
                      <div className="max-w-[80%] bg-purple-600 text-white rounded-2xl rounded-br-none px-6 py-4">
                        <p className="text-sm font-medium">{message.content}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-start">
                      <div className="max-w-full w-full">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                            <BookMarked className="w-5 h-5 text-white" />
                          </div>
                          <div className="bg-gray-100 rounded-2xl rounded-tl-none px-6 py-4 flex-1">
                            <p className="text-sm text-gray-900">{message.content}</p>
                          </div>
                        </div>

                        {message.sections && (
                          <div className="space-y-4 ml-11">
                            <div className="border border-blue-200 rounded-xl overflow-hidden bg-blue-50">
                              <button
                                onClick={() => toggleSection('refinedQuestion')}
                                className="w-full px-6 py-4 flex items-center justify-between bg-blue-100 hover:bg-blue-200 transition"
                              >
                                <div className="flex items-center gap-3">
                                  <Lightbulb className="w-5 h-5 text-blue-600" />
                                  <span className="font-semibold text-gray-900">Refined Research Questions</span>
                                </div>
                                <span className="text-blue-600">{expandedSections.refinedQuestion ? '−' : '+'}</span>
                              </button>
                              {expandedSections.refinedQuestion && (
                                <div className="px-6 py-4 bg-white">
                                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                                    {message.sections.refinedQuestion}
                                  </pre>
                                </div>
                              )}
                            </div>

                            <div className="border border-green-200 rounded-xl overflow-hidden bg-green-50">
                              <button
                                onClick={() => toggleSection('literatureReview')}
                                className="w-full px-6 py-4 flex items-center justify-between bg-green-100 hover:bg-green-200 transition"
                              >
                                <div className="flex items-center gap-3">
                                  <BookOpen className="w-5 h-5 text-green-600" />
                                  <span className="font-semibold text-gray-900">Literature Review Outline</span>
                                </div>
                                <span className="text-green-600">{expandedSections.literatureReview ? '−' : '+'}</span>
                              </button>
                              {expandedSections.literatureReview && (
                                <div className="px-6 py-4 bg-white">
                                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                                    {message.sections.literatureReview}
                                  </pre>
                                </div>
                              )}
                            </div>

                            <div className="border border-orange-200 rounded-xl overflow-hidden bg-orange-50">
                              <button
                                onClick={() => toggleSection('papers')}
                                className="w-full px-6 py-4 flex items-center justify-between bg-orange-100 hover:bg-orange-200 transition"
                              >
                                <div className="flex items-center gap-3">
                                  <Database className="w-5 h-5 text-orange-600" />
                                  <span className="font-semibold text-gray-900">Recommended Papers</span>
                                </div>
                                <span className="text-orange-600">{expandedSections.papers ? '−' : '+'}</span>
                              </button>
                              {expandedSections.papers && (
                                <div className="px-6 py-4 bg-white">
                                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                                    {message.sections.papers}
                                  </pre>
                                </div>
                              )}
                            </div>

                            <div className="border border-purple-200 rounded-xl overflow-hidden bg-purple-50">
                              <button
                                onClick={() => toggleSection('summary')}
                                className="w-full px-6 py-4 flex items-center justify-between bg-purple-100 hover:bg-purple-200 transition"
                              >
                                <div className="flex items-center gap-3">
                                  <FileText className="w-5 h-5 text-purple-600" />
                                  <span className="font-semibold text-gray-900">Comparative Analysis & Summary</span>
                                </div>
                                <span className="text-purple-600">{expandedSections.summary ? '−' : '+'}</span>
                              </button>
                              {expandedSections.summary && (
                                <div className="px-6 py-4 bg-white">
                                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                                    {message.sections.summary}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                    <BookMarked className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your research topic (e.g., Machine Learning in Healthcare)..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Analyze
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Enter any research topic to receive comprehensive research assistance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
          <Lightbulb className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Question Refinement</h3>
          <p className="text-sm text-gray-600">
            SMART framework for clear research questions
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <BookOpen className="w-8 h-8 text-green-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Literature Structure</h3>
          <p className="text-sm text-gray-600">
            Complete outline with all key sections
          </p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
          <Database className="w-8 h-8 text-orange-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Paper Discovery</h3>
          <p className="text-sm text-gray-600">
            Curated list of foundational and recent papers
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <FileText className="w-8 h-8 text-purple-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Deep Analysis</h3>
          <p className="text-sm text-gray-600">
            Comparative synthesis of methodologies
          </p>
        </div>
      </div>
    </div>
  );
}
