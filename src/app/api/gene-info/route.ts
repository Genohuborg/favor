import { NextRequest, NextResponse } from "next/server";

let weaviate: any = null;
let client: any = null;

async function getWeaviateClient() {
  if (!client) {
    try {
      // Dynamic import to avoid module resolution issues
      weaviate = await import("weaviate-client");

      client = await weaviate.default.connectToWeaviateCloud(
        process.env.WEAVIATE_CLUSTER_URL || "",
        {
          authCredentials: new weaviate.default.ApiKey(
            process.env.WEAVIATE_API_KEY || "",
          ),
          headers: {
            // NOT the chatbot's key. FAVOR-GPT moved to Anthropic, but this
            // header is Weaviate's own: the `gene-info` collection was indexed
            // with the text2vec-openai vectorizer, so Weaviate needs an OpenAI
            // key to embed the *query* at search time. Anthropic publishes no
            // embeddings API, so there is no like-for-like swap -- dropping
            // this header breaks nearText gene search. Retiring OPENAI_API_KEY
            // entirely means re-indexing the collection under a different
            // vectorizer first.
            "X-OpenAI-Api-Key": process.env.OPENAI_API_KEY || "",
          },
          timeout: { init: 30, query: 60, insert: 120 },
          skipInitChecks: true,
        },
      );
    } catch (error) {
      console.error("Error initializing Weaviate client:", error);
      throw new Error("Failed to initialize Weaviate client");
    }
  }
  return client;
}

async function fetchGeneInfo(gene: string | undefined, query: string) {
  try {
    const weaviateClient = await getWeaviateClient();
    const info = weaviateClient.collections.get("GeneInfo");

    const response = await info.query.nearText(query, {
      limit: 3,
      filters: info.filter.byProperty("symbol").equal(gene),
    });

    return response.objects[0]?.properties;
  } catch (error) {
    console.error("Error fetching gene info from Weaviate:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { gene, question } = await request.json();

    if (!gene || !question) {
      return NextResponse.json(
        { error: "Gene symbol and question are required" },
        { status: 400 },
      );
    }

    const geneInfo = await fetchGeneInfo(gene, question);

    if (!geneInfo) {
      return NextResponse.json(
        { error: `Gene annotation for ${gene} could not be found` },
        { status: 404 },
      );
    }

    return NextResponse.json({
      gene,
      question,
      annotation: geneInfo,
      source: "weaviate_ai",
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
