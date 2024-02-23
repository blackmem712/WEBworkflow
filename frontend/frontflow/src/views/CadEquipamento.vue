<template>
  <div class="pai-container">
    <div class="main-main">


      <span class="main-text">CADASTRO DE EQUIPAMENTOS</span>

      <div class="search-box">
        <input type="text" class="search-text" placeholder="Pesquisar...">
        <a class="bx bx-search"></a>
      </div>

      <span class="main-text02">Insira os dados do cliente</span>


      <div class="main-row">
        <div class="main-textfield">
          <div class="main-label">
            <label class="main-text3">Nome Completo</label>
          </div>
            <input type="text" id="" name="nome" class="main-container1"/>
        </div>
      </div>

      <div class="main-row1">


        <div class="main-textfield">
          <div class="main-label1">
            <label class="main-text03">CPF</label>
          </div>
            <input type="text" id="" name="cpf" class="main-container2"/>
        </div>

        <div class="main-textfield1">
          <div class="main-label2">
            <label class="main-text03">Email</label> 
          </div>
            <input type="text" id="" name="email" class="main-container3"/>
        </div>

      </div>


      
      <div class="main-row2">


        <div class="main-textfield">
          <div class="main-label1">
            <label class="main-text03">Cidade</label>
          </div>
            <input type="text" id="" name="cidade" class="main-container2"/>
        </div>

        <div class="main-textfield1">
          <div class="main-label2">
            <label class="main-text03">TELEFONE</label> 
          </div>
            <input type="text" id="" name="telefone" class="main-container3"/>
        </div>


        
      </div>

      <div class="main-row3">


        <div class="main-textfield1">
          <div class="main-label2">
            <label class="main-text03">Endereco</label> 
          </div>
            <input type="text" id="" name="endereco" class="main-container4"/>
        </div>


      </div>


      <button type="button" class="main-button">
        <a class="main-text22">Salvar</a>
      </button>


    </div>
  </div>


</template>
    
    <script>
    
    export default {
    
      name:"cad-equip"
    }
    </script>

<style scoped>

  @import url('https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css');
  .pai-container {
  width: 100%;
  height: 100%;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: flex-start;
}
.main-main {
  gap: 32px;
  width: 700px;
  padding: 50px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0);
}


.search-box{
  gap: 10px;
  display: flex;
  padding: 10px 16px;
  align-self: stretch;
  align-items: flex-start;
  flex-shrink: 0;
  border-color: rgba(0, 0, 0, 1);
  border-style: solid;
  border-width: 1px;
  border-radius: 8px;
  background-color: rgb(255, 245, 245);
  justify-content: space-between;

}
.search-text{

  background-color: none;
  border: 0;
  outline: 0;
  font-size: 16px;

}
.bx-search{
    
   color: black;

}

.main-text {
  color: rgb(0, 0, 0);
  font-size: 24px;
  font-style: SemiBold;
  font-family: Archivo;
  font-weight: 600;
  line-height: 30px;
  font-family: "Poppins", sans-serif;

}

.main-text02 {
  color: rgba(0, 0, 0, 1);
  font-size: 16px;
  font-style: Light;
  font-family: Roboto;
  font-weight: 300;
  line-height: 24px;
  font-family: "Poppins", sans-serif;
}
.main-row,
.main-row1,
.main-row2,
.main-row3 {
  gap: 30px;
  display: flex;
  align-self: stretch;
  align-items: flex-start;
  flex-shrink: 0;
}
.main-textfield,
.main-textfield1,
.main-textfield2,
.main-textfield3,
.main-textfield4,
.main-textfield5 {
  gap: 4px;
  flex-grow: 1;
  display: flex;
  align-items: flex-start;
  flex-shrink: 0;
  flex-direction: column;
}
.main-label,
.main-label1,
.main-label2,
.main-label3,
.main-label4,
.main-label5 {
  gap: 10px;
  display: flex;
  align-self: stretch;
  align-items: flex-start;
  flex-shrink: 0;
  color: rgb(0, 0, 0);
  font-family: "Poppins", sans-serif;

}
.main-container1,
.main-container2,
.main-container3,
.main-container4,
.main-container5,
.main-container6 {
  gap: 10px;
  display: flex;
  padding: 10px 16px;
  align-self: stretch;
  align-items: flex-start;
  flex-shrink: 0;
  border-color: rgba(0, 0, 0, 1);
  border-style: solid;
  border-width: 1px;
  border-radius: 8px;
  background-color: rgb(255, 245, 245);
  background-color: none;
  outline: 0;
  font-size: 16px;
}
.main-button {
  gap: 10px;
  width: 119px;
  display: flex;
  padding: 10px 16px;
  align-self: stretch;
  align-items: flex-start;
  flex-shrink: 0;
  border-color: rgba(0, 0, 0, 1);
  border-style: solid;
  border-width: 1px;
  border-radius: 08px;
  background-color: rgba(0, 0, 0, 0.699);
}
.main-text22 {
  color: rgb(255, 255, 255);
  font-size: 16px;
  font-style: Medium;
  font-family: Roboto;
  font-weight: 500;
  line-height: 24px;
}
  
  
  
  </style>