
const getRandomQuestion = () => {
    $("#QuestionId").val("");
    $.ajax({
        url: "getRandomQuestion",
        method: "POST",
        success: function(data){
            console.log(data);
            $('.word-b').html( data.word[0].toUpperCase() + data.word.slice(1));
            $('.word-d').html(data.definition);
            $(".word-t").html(data.wordtype);
            $("#QuestionId").val(data.id);
            $(".translateGoogle").attr("href", "https://translate.google.com/?sl=en&text="+data.word+"&op=translate");
            $(".showIt").fadeIn();
            $('.word-d').hide();
        }
    });
}
const processQuestion = (score) => {
    const id = $("#QuestionId").val();
    $.ajax({
      url: "/processQuestion",
      method: "POST",
      
      data: { id: id, score: score },
      success: function(data) {
        getRandomQuestion();
      }
    });
};

$(".showIt").on('click', function(){
    $('.word-d').fadeIn();
    $(this).hide();
});
getRandomQuestion();