export const toolboxXML = `
<xml id="toolbox" style="display: none">
  <category name="Screen" colour="160">
    <block type="bart_put"></block>
    <block type="bart_clear"></block>
    <block type="bart_move"></block>
    <block type="bart_focus"></block>
  </category>
  <category name="Control" colour="120">
    <block type="bart_wait">
      <value name="SECONDS">
        <block type="bart_number">
          <field name="VALUE">1</field>
        </block>
      </value>
    </block>
    <block type="bart_repeat"></block>
    <block type="bart_while"></block>
    <block type="bart_if_else"></block>
    <block type="bart_switch_case"></block>
  </category>
  <category name="Sensing" colour="290">
    <block type="bart_input"></block>
  </category>
  <category name="Strings" colour="160">
    <block type="bart_string"></block>
    <block type="bart_join"></block>
  </category>
  <category name="Numbers" colour="230">
    <block type="bart_number"></block>
    <block type="bart_add"></block>
    <block type="bart_subtract"></block>
    <block type="bart_multiply"></block>
    <block type="bart_divide"></block>
  </category>
  <category name="Logic" colour="210">
    <block type="bart_logic_op"></block>
    <block type="bart_not"></block>
    <block type="bart_equals"></block>
  </category>
</xml>
`;