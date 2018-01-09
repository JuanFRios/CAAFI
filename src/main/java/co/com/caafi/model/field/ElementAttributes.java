package co.com.caafi.model.field;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ElementAttributes {
	private String layout;
	
	@JsonProperty("layout-sm")
	private String layoutSm;
	
	public String getLayout() {
		return layout;
	}
	public void setLayout(String layout) {
		this.layout = layout;
	}
	
	public String getLayoutSm() {
		return layoutSm;
	}
	
	public void setLayoutSm(String layoutSm) {
		this.layoutSm = layoutSm;
	}
}
