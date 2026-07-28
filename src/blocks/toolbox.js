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
    <block type="bart_key_pressed"></block>
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
    <block type="bart_true"></block>
    <block type="bart_false"></block>
  </category>
  <category name="Memory" colour="330">
    <block type="bart_store">
      <value name="ADDR">
        <block type="bart_number">
          <field name="VALUE">0</field>
        </block>
      </value>
      <value name="VALUE">
        <block type="bart_number">
          <field name="VALUE">0</field>
        </block>
      </value>
    </block>
    <block type="bart_flush_ram"></block>
    <block type="bart_load">
      <value name="ADDR">
        <block type="bart_number">
          <field name="VALUE">0</field>
        </block>
      </value>
    </block>
  </category>
  <category name="Functions" colour="20">
    <block type="bart_function">
      <field name="NAME">myFunction</field>
    </block>
    <block type="bart_call_function">
      <field name="NAME">myFunction</field>
    </block>
    <block type="bart_call_boolean">
      <field name="NAME">myFunction</field>
    </block>
    <block type="bart_call_value">
      <field name="NAME">myFunction</field>
    </block>
    <block type="bart_return">
      <value name="VALUE">
        <block type="bart_number">
          <field name="VALUE">0</field>
        </block>
      </value>
    </block>
  </category>
</xml>
`;
