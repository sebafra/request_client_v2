export class Constants {
  public static APP_NAME = "Request App";
  //public static APP_VERSION = "0.2.2(E)";
  public static APP_VERSION = "0.2.3";

  public static BUSINESS_BRANCH = {id:"1",name:"Request"};
  public static BUSINESS_WAITER = {id:"",name:""};
  
  public static CURRENT_ORDER = [];
  public static API_BASE_URL = null;

  // API METHODS
  public static API_METHOD_CATEGORY = "/categories";
  public static API_METHOD_SUBCATEGORY= "/subcategories";
  public static API_METHOD_ARTICLE= "/articles";
  public static API_METHOD_ORDER= "/orders";
  public static API_METHOD_TABLE= "/tables";
  public static API_METHOD_WAITER= "/waiters";
  public static API_METHOD_PREFERENCE= "/preferences";
  public static API_METHOD_COMBO= "/combos";
  public static API_METHOD_COMBO_ARTICLES= "/combo_articles";
  
  // API METHODS MANAGEMENT
  public static API_METHOD_BRANCH= "/branches/local";
  public static API_METHOD_VALIDATE= "/validate";

  // CONFIGURATIONS
  public static COMBO_COMPLETE = "false";
}
