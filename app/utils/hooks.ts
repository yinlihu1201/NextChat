import { useMemo } from "react";
import { useAccessStore, useAppConfig } from "../store";
import { collectModelsWithDefaultModel } from "./model";
import { ServiceProvider } from "../constant";

const CustomSeq = {
  val: -1000,
  cache: new Map<string, number>(),
  next: (id: string) => {
    if (CustomSeq.cache.has(id)) {
      return CustomSeq.cache.get(id) as number;
    } else {
      let seq = CustomSeq.val++;
      CustomSeq.cache.set(id, seq);
      return seq;
    }
  },
};

const customProvider = (providerName: string) => ({
  id: providerName.toLowerCase(),
  providerName: providerName,
  providerType: "custom",
  sorted: CustomSeq.next(providerName),
});

export function useAllModels() {
  const accessStore = useAccessStore();
  const configStore = useAppConfig();
  const models = useMemo(() => {
    const allModels = collectModelsWithDefaultModel(
      configStore.models,
      [configStore.customModels, accessStore.customModels].join(","),
      accessStore.defaultModel,
    );

    // Add custom OpenAI models from accessStore.customOpenAIModels
    const customOpenAIModels = accessStore.customOpenAIModels
      .filter((m) => m.modelName && m.url && m.apiKey)
      .map((m) => ({
        name: m.modelName,
        displayName: m.modelName,
        available: true,
        sorted: CustomSeq.next(`custom-${m.id}`),
        provider: customProvider(ServiceProvider.CustomOpenAI),
      }));

    return [...allModels, ...customOpenAIModels];
  }, [
    accessStore.customModels,
    accessStore.customOpenAIModels,
    accessStore.defaultModel,
    configStore.customModels,
    configStore.models,
  ]);

  return models;
}
