import { ReactUnitFrame } from "wafer-host/react";
import { windowIds } from "@/domain/types";
import { interUnitFactories } from "@/domain/unit-entries";
import { actions } from "@/store/actions";
import { store } from "@/store/store";
import { WindowFrame } from "@lib/window-system";
import { ScalerBoxDW } from "@lib/components/headless/scaler-box-d";
import { automationChannelGetters } from "@/store/automation-channel-getters";
import { channelListColumnComponents } from "@/views/window/components/channel-list-column";
import { cz } from "@lib/utils/cz";
import { useUnitStuffReporter } from "@/views/window/unit-stuff-reporter";
import { useLayoutEffect } from "react";

const ChannelListColumn = () => {
  const { currentAutomationChannelId } = store.useSnapshot();
  const channelIds = automationChannelGetters.useAutomationChannelIds();
  const canAdd = channelIds.length < 4;
  const canDelete = channelIds.length > 0;

  const handleRemove = () => {
    const ok = window.confirm(`are you sure to remove the automation channel?`);
    if (ok) {
      actions.removeCurrentAutomationChannel();
    }
  };
  const { ColumnFrame, ChannelButton, AddButton, DeleteButton } =
    channelListColumnComponents;
  return (
    <ColumnFrame>
      {channelIds.map((id, index) => (
        <ChannelButton
          key={id}
          text={`${index + 1}`}
          active={id === currentAutomationChannelId}
          onClick={() => actions.selectAutomationChannel(id)}
        />
      ))}
      {canAdd && <AddButton onClick={actions.addAutomationEditorUnit} />}
      <div className="grow" />
      {canDelete && <DeleteButton onClick={handleRemove} />}
    </ColumnFrame>
  );
};

const EditorUnitItemView = ({ unitId }: { unitId: string }) => {
  const { currentAutomationChannelId } = store.useSnapshot();
  const displayed = unitId === currentAutomationChannelId;
  const reporter = useUnitStuffReporter(unitId);
  useLayoutEffect(reporter.reportLoadStart, []);
  return (
    <div className={cz("absolute-full", !displayed && "invisible")}>
      <ReactUnitFrame
        unitId={unitId}
        unitTemplateFn={interUnitFactories.automationEditor}
        onUnitInstanceLoaded={reporter.reportLoaded}
      />
    </div>
  );
};

const EditorContentSection = () => {
  const unitItems = automationChannelGetters.useAutomationEditorUnitItems();
  if (unitItems.length === 0) {
    return (
      <div className="bg-#ccc w-full h-full flex-c">
        <div className="flex-vc gap-1 p-6">
          <span>no automation channels</span>
          <span>create new one by clicking the add button</span>
        </div>
      </div>
    );
  }
  return (
    <div className="flex-grow relative overflow-hidden">
      {unitItems.map((item) => (
        <EditorUnitItemView key={item.unitId} unitId={item.unitId} />
      ))}
    </div>
  );
};

export const AutomationEditorWindow = () => {
  return (
    <WindowFrame id={windowIds.automationEditor} title="automation">
      <ScalerBoxDW designWidth={1100} scaleDirection="lower">
        <div className="h-full flex-h">
          <ChannelListColumn />
          <EditorContentSection />
        </div>
      </ScalerBoxDW>
    </WindowFrame>
  );
};
